const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const PATH = require('../../config/path');
const config = require('./webpack.config.v3');

config.output.filename = '[name].bundle.[hash].js';

config.plugins.push(
  new ExtractTextPlugin("[name].bundle.[hash].css", {
    allChunks: true
  }),
  new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }),
  new webpack.optimize.AggressiveMergingPlugin(),
  new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.js$|\.css$|\.html$/,
    minRatio: 0.8
  }),
  new webpack.HashedModuleIdsPlugin({
    hashFunction: 'sha256',
    hashDigest: 'hex',
    hashDigestLength: 20
  }),
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 5, // 必须大于或等于 1
    minChunkSize: 1000
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    options: {
      context: PATH.ROOT_PATH,
    }
  })
);

module.exports = config;
