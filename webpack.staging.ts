import * as webpack from 'webpack';
import * as path from 'path';

declare var __dirname: string;

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const express = require('express');

const config: webpack.Configuration = {

  context: __dirname,

  target: 'web',

  entry: {
    main: './staging/main',
  },

  devtool: 'eval-source-map',

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist-staging')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.less', '.json']
  },

  devServer: {
    port: 9000,
    contentBase: false,
    setup: (app: any) => {
      app.use('/components/', express.static(path.resolve(__dirname, 'dist')));
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: 'source-map-loader'
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              strictMath: true,
              noIeCompat: true,
              compress: false,
              sourceMap: true
            }
          }
        ]
      },
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
      IS_PROD: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),
    new CopyWebpackPlugin([
      {from: 'node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js.map', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js.map', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js.map', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js.map', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js', to: 'js/'},
      {from: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js.map', to: 'js/'},
    ]),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        'js/custom-elements-es5-adapter.js',
        'js/webcomponents-loader.js',
      ],
      append: false
    }),
    new HtmlWebpackPlugin({
      template: './staging/index.html',
      xhtml: true,
      inject: true
    }),
  ]
};

export default config;
