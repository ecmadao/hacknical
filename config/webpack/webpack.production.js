const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

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
);
config.debug = false;
config.displayErrorDetails = false;

module.exports = config;
