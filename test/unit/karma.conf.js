var path = require('path');

module.exports = function (config) {
  config.set({
    autoWatch: true,

    basePath: "../../",

    browsers: ["ChromeHeadless"],

    colors: true,

    exclude: [],

    files: [
      "test/unit/*.ts",
      "test/unit/**/*.ts"
    ],

    frameworks: ["jasmine"],

    logLevel: config.LOG_INFO,

    /*
     * By default, Karma loads all sibling NPM modules which have a name
     * starting with karma-*. You can also explicitly list plugins you want
     * to load via the plugins configuration setting.
     */
    /*
     plugins: [
     "karma-*"
     ],
     */

    port: 9876,

    /*
     * A map of preprocessors to use. Requires the corresponding karma-*
     * npm module to be npm installed and added to the "plugins" field.
     */
    preprocessors: {
      "test/unit/*.ts": ["webpack", "sourcemap"],
      "test/unit/**/*.ts": ["webpack", "sourcemap"]
    },

    reporters: ['progress'],

    junitReporter: {
      outputDir: './dist/junit/',
      useBrowserName: true // add browser name to report and classes names
    },

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    singleRun: false,

    webpack: {
      devtool: 'inline-source-map',

      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less', '.json']
      },

      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/
          }
        ]
      }
    }
  });
};
