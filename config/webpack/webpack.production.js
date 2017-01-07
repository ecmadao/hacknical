const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require('./webpack.config');

config.output.filename = '[name].bundle.[hash].js';

config.plugins.push(
  new ExtractTextPlugin("[name].bundle.[hash].css", {
    allChunks: true
  }),
  new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  })
);
config.debug = false;
config.displayErrorDetails = false;

module.exports = config;
