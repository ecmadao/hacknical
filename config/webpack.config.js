const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssImport = require("postcss-import");
const cssnext = require("postcss-cssnext");

const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

const PATH = require('./path');
const path = require('path');
const fs = require('fs');
const entryFiles = fs.readdirSync(PATH.ENTRY_PATH);

const files = [];
const entries = {};

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0];
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = filepath;
});

module.exports = {
  context: PATH.ROOT_PATH,
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: PATH.BUILD_PATH
  },
  module: {
    loaders: [
      {test: require.resolve("jquery"), loader: "expose?jQuery"},
      {test: require.resolve("jquery"), loader: "expose?$"},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015"]
        }
      }
    ],
  },
  resolve: {
    root: PATH.SOURCE_PATH,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx'],
    alias: {
      COMPONENTS: path.join(PATH.SOURCE_PATH, 'components'),
      MOCK: path.join(PATH.SOURCE_PATH, 'mock'),
      // UTILS: path.join(PATH.SOURCE_PATH, 'utils'),
      // MODULES: path.join(PATH.SOURCE_PATH, 'modules'),
    }
  },
  postcss: function() {
    return [
      postcssImport({addDependencyTo: webpack}),
      cssnext({autoprefixer: {browsers: "ie >= 9, ..."}})
    ];
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new ExtractTextPlugin("[name].bundle.css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new CleanPlugin(PATH.BUILD_PATH, {
      root: PATH.ROOT_PATH,
      verbose: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(PATH.TEMPLATES_PATH, 'index.html'),
      chunks: ['index']
    })
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
  devtool: "cheap-module-eval-source-map"
};
