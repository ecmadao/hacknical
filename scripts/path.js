const path = require('path');

const CURRENT_PATH = path.resolve(__dirname);
const ROOT_PATH = path.join(__dirname, '../');
const PUBLIC_PATH = path.join(ROOT_PATH, './public');

module.exports = {
  ROOT_PATH,
  PUBLIC_PATH
}
