const path = require('path');

const CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
const ROOT_PATH = path.join(__dirname, '../../'); // 项目根目录
const MODULES_PATH = path.join(ROOT_PATH, './node_modules'); // node包目录
const BUILD_PATH = path.resolve(ROOT_PATH, './public/assets'); // 最后输出放置公共资源的目录
const SERVER_PATH = '/assets/';
const SOURCE_PATH = path.join(ROOT_PATH, './app/frontend');
const ENTRY_PATH = path.join(ROOT_PATH, './app/frontend/entries'); // webpack入口文件
// const TEMPLATES_PATH = path.join(ROOT_PATH, './src/templates'); // html template 入口文件

module.exports = {
  ROOT_PATH,
  BUILD_PATH,
  SERVER_PATH,
  CURRENT_PATH,
  ENTRY_PATH,
  // TEMPLATES_PATH,
  SOURCE_PATH
};
