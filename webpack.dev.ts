import * as webpack from 'webpack';
import * as path from 'path';
declare var __dirname: string;

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const InlineFileWebpackPlugin = require('inline-file-webpack-plugin');

const extractCss = new ExtractTextPlugin('main.css');

const config: webpack.Configuration = {

  context: __dirname,

  target: 'web',

  entry: {
    main: ['./src/main']
  },

  devtool: 'eval-source-map',

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
      'process.env.NODE_ENV': JSON.stringify(ENV),
      IS_PROD: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    extractCss,
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunksSortMode: 'dependency',
      inject: false,
      xhtml: true
    }),
    new InlineFileWebpackPlugin({
      input: './dist/index.html',
      prefix: '/*-- ',
      suffix: ' --*/',
    })
  ]
};

export default config;
