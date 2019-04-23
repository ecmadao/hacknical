const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config.v3')
const PATH = require('../../config/path')

config.plugins.push(
  new ExtractTextPlugin({
    filename: '[name].bundle.css',
    allChunks: true,
    ignoreOrder: true
  }),
  new webpack.LoaderOptionsPlugin({
    debug: true,
    minimize: true,
    options: {
      context: PATH.ROOT_PATH,
    }
  }),
  new webpack.SourceMapDevToolPlugin()
)
config.devtool = '#source-map'
// config.devtool = "cheap-module-eval-source-map"

module.exports = config
