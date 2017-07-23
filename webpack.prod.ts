import * as webpack from 'webpack';
import * as path from 'path';
declare var __dirname: string;

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const InlineFileWebpackPlugin = require('inline-file-webpack-plugin');

const extractCss = new ExtractTextPlugin('main.css');

const config: webpack.Configuration = {

  target: 'web',

  entry: {
    main: ['./src/main']
  },

  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less', '.json']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.less$/,
        use: extractCss.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              /* TODO: use less-plugin-clean-css */
              loader: 'less-loader',
              options: {
                strictMath: true,
                noIeCompat: true,
                compress: true
              },
            }
          ]
        })
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      // Any occurrence of process.env.NODE_ENV in the imported code is replaced with "production"
      'process.env.NODE_ENV': JSON.stringify(ENV),
      IS_PROD: true
    }),
    extractCss,
    new ClosureCompilerPlugin({
      compiler: {
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        compilation_level: 'ADVANCED',
        externs: './externs.js'
      },
      concurrency: 3,
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'dependency',
      inject: false,
      xhtml: true,
      minify: {
        collapseInlineTagWhitespace: false,
        collapseWhitespace: true,
        // conservativeCollapse: true,
        removeComments: true,
        sortAttributes: true,
        sortClassName: true
      }
    }),
    new InlineFileWebpackPlugin({
      input: './dist/index.html',
      prefix: '/*-- ',
      suffix: ' --*/',
    }),
  ]
};

export default config;
