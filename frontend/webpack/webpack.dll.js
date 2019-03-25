
const path = require('path')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const PATH = require('../../config/path')

const env = process.env.NODE_ENV || 'localdev'
const isProduction = env === 'production'
const libraryName = isProduction ? '[name]_[chunkhash]_library' : '[name]_library'

const plugins = [
  new webpack.DllPlugin({
    path: path.join(PATH.BUILD_PATH, '[name]-manifest.json'),
    name: libraryName
  }),
  new CleanPlugin(PATH.BUILD_PATH, {
    root: PATH.ROOT_PATH,
    verbose: true
  }),
  new AssetsPlugin({
    includeManifest: 'manifest',
    path: PATH.BUILD_PATH,
    filename: 'webpack-assets.json',
    prettyPrint: true
  })
]

if (isProduction) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$/,
      minRatio: 0.9
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.js$/,
      minRatio: 0.9
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
      'babel-polyfill',
      'moment',
      'classnames',
      'prop-types'
    ]
  },
  output: {
    path: PATH.BUILD_PATH,
    publicPath: PATH.PUBLIC_PATH,
    filename: isProduction ? '[name].[chunkhash].dll.js' : '[name].dll.js',
    library: libraryName
  },
  plugins
}
