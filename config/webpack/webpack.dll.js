const path = require('path');
const PATH = require('./path');
const webpack = require('webpack');

const plugins = [
  new webpack.DllPlugin({
    path: path.join(PATH.DLL_PATH, '[name]-manifest.json'),
    name: '[name]_library'
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  )
}

module.exports = {
  entry: {
    react: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-portal',
      'react-addons-shallow-compare',
      'redux',
      'redux-actions',
      'redux-thunk',
      'redux-logger'
    ],
    runtime: [
      'babel-polyfill',
      'moment',
      'classnames',
    ]
  },
  output: {
    path: PATH.DLL_PATH,
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins
};
