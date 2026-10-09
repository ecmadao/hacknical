const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const PATH = require('../../config/path')

const env = process.env.NODE_ENV || 'localdev'
const isProduction = env === 'production'
const libraryName = '[name]_library'

const plugins = [
  new webpack.DllPlugin({
    path: path.join(PATH.BUILD_PATH, '[name]-manifest.json'),
    name: libraryName
  }),
  new CleanWebpackPlugin(),
  new AssetsPlugin({
    includeManifest: 'manifest',
    path: PATH.BUILD_PATH,
    filename: 'webpack-assets.json',
    prettyPrint: true
  })
]

if (isProduction) {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$/,
      minRatio: 0.9
    })
  )
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    react: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'react-router-redux',
      'react-router-config',
      'react-async-component',
      'redux',
      'redux-actions',
      'redux-thunk',
      'redux-logger',
      'history'
    ],
    runtime: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      'moment',
      'classnames',
      'prop-types'
    ]
  },
  output: {
    path: PATH.BUILD_PATH,
    publicPath: PATH.PUBLIC_PATH,
    filename: isProduction ? '[name].[contenthash].dll.js' : '[name].dll.js',
    library: libraryName
  },
  plugins
}
