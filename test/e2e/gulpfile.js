const gulp = require('gulp'),
  gutil = require('gulp-util'),
  hostname = 'localhost',
  port = 9000;

let httpServer = null;

gulp.task('build-staging', (cb) => {
  const npmRun = require('npm-run');

  const child = npmRun.spawn(
    'webpack',
    '--config ../../webpack.staging.ts'.split(' '),
    {stdio: 'inherit'});

  child.on('exit', function (code) {
    if (code === 0) {
      cb();
    } else {
      cb(`Webpack staging exit code: ${code}`);
    }
  })
});

gulp.task('server-staging', ['build-staging'], (cb) => {
  const fs = require('fs'),
    http = require('http'),
    path = require('path'),
    dispatch = require('dispatch'),
    finalhandler = require('finalhandler'),
    serveStatic = require('serve-static'),
    serveStaging = serveStatic(path.resolve(__dirname, '..', '..', 'dist-staging')),
    distPath = path.resolve(__dirname, '..', '..', 'dist'),
    serveComponents = serveStatic(distPath);

  if (!fs.existsSync(distPath)) {
    cb('Component artifacts not found - has it been built?');
    return;
  }

  const routes = {
    '/components/(.*)': (req, res, path) => {
      req.url = path;
      serveComponents(req, res, finalhandler(req, res));
    },
    '/': (req, res) => {
      req.url = '/index.html';
      serveStaging(req, res, finalhandler(req, res));
    },
    '/.*': (req, res) => {
      serveStaging(req, res, finalhandler(req, res));
    }
  };

  httpServer = http.createServer(dispatch(routes));

  httpServer.listen(port, hostname, () => {
    gutil.log(`Server running at http://${hostname}:${port}/`);
    gutil.log('Enter Ctrl+C to exit');
    cb();
  });
});

gulp.task('compile-e2e', () => {
  const ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json");

  return tsProject.src()
    .pipe(tsProject())
    .js
    .pipe(gulp.dest("../../dist-e2e"));
});

gulp.task('test-e2e', ['server-staging', 'compile-e2e'], (cb) => {
  const npmRun = require('npm-run');

  const child = npmRun.spawn(
    'protractor',
    '../../dist-e2e/protractor.conf.js'.split(' '),
    {stdio: 'inherit'});

  child.on('exit', function (code) {
    const wrappedCb = code === 0 ? cb : () => cb(`Protractor exit code: ${code}`);
    if (httpServer) {
      httpServer.close(wrappedCb);
    } else {
      wrappedCb();
    }
  });
});
