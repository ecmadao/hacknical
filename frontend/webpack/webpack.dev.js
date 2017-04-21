const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require('./webpack.config');

config.plugins.push(
  new ExtractTextPlugin("[name].bundle.css", {
    allChunks: true
  })
);
config.debug = true;
config.displayErrorDetails = true;
config.devtool = "cheap-module-eval-source-map";

module.exports = config;
