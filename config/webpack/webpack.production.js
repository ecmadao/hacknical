const webpack = require('webpack');

const config = require('./webpack.config');

config.plugins.push(
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
