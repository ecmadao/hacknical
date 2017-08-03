const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

const PATH = require('../../config/path');

const plugins = [
  new webpack.DllPlugin({
    path: path.join(PATH.DLL_PATH, '[name]-manifest.json'),
    name: '[name]_library'
  }),
  new CleanPlugin(PATH.DLL_PATH, {
    root: PATH.ROOT_PATH,
    verbose: true
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

module.exports = {
  entry: {
    react: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-portal',
      'redux',
      'redux-actions',
      'redux-thunk',
      'redux-logger',
      'prop-types'
    ],
    runtime: [
      'babel-polyfill',
      'moment',
      'classnames',
    ]
  },
  output: {
    path: PATH.DLL_PATH,
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins
};
