const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const config = require('./webpack.config.v3')

config.mode = 'production'
config.output.filename = '[name].bundle.[contenthash].js'

config.optimization = {
  moduleIds: 'deterministic'
}

config.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].bundle.[contenthash].css',
    ignoreOrder: true
  }),
  new CompressionPlugin({
    filename: '[path][base].gz',
    algorithm: 'gzip',
    test: /\.(js|css|html|woff2|woff|ttf|eot|jpg|jpeg|png|svg)/,
    minRatio: 0.9
  }),
  new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 5
  })
)

module.exports = config
