const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./webpack.config.v3')

config.mode = 'development'
config.devtool = 'source-map'
config.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].bundle.css',
    ignoreOrder: true
  })
)

module.exports = config
