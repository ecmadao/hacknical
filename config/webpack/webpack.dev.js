const webpack = require('webpack');
// const DashboardPlugin = require('webpack-dashboard/plugin');

const config = require('./webpack.config');

// config.plugins.push(new DashboardPlugin());
config.debug = true;
config.displayErrorDetails = true;
config.devtool = "cheap-module-eval-source-map";

module.exports = config;
