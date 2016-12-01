const webpack = require('webpack');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const dashboard = new Dashboard();

const config = require('./webpack.config');

config.plugins.push(new DashboardPlugin(dashboard.setData));
config.debug = true;
config.devtool = "cheap-module-eval-source-map";

module.exports = config;
