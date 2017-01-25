const config = require('config');

const APP_NAME = config.get('appName');
const CDN = config.get('cdn');
const CDN_URL = `${CDN}/${APP_NAME}`;
console.log(process.env)
console.log(process.env.npm_package_version)
const APP_VERSION = process.env.APP_VERSION;
console.log(`APP_VERSION: ${APP_VERSION}`)

const URL = APP_VERSION ? `${CDN_URL}/${APP_VERSION}` : CDN_URL;

module.exports = {
  URL: CDN ? URL : ''
}
