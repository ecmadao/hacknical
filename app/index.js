const config = require('config');

const opbeatConf = config.get('opbeat');
require('opbeat').start(opbeatConf);

require('babel-core/register');
require('babel-polyfill');
require('./bin/app.js');
