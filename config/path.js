
const path = require('path')
const config = require('config')
const git = require('git-rev-sync')

const CDN = config.get('cdn')
const appVersion = git.short()
const CDN_URI = appVersion

const CDN_URL = CDN ? `${CDN}/${CDN_URI}` : ''
const PUBLIC_PATH = CDN ? `${CDN}/${CDN_URI}/assets/` : '/assets/'

const ROOT_PATH = path.join(__dirname, '../') // 项目根目录
const ASSETS_PATH = path.join(ROOT_PATH, './public')

const MODULES_PATH = path.join(ROOT_PATH, './node_modules') // node包目录
const BUILD_PATH = path.resolve(ASSETS_PATH, './assets') // 最后输出放置公共资源的目录
const DLL_PATH = path.resolve(ASSETS_PATH, './dll')
const SOURCE_PATH = path.join(ROOT_PATH, './frontend')
const ENTRY_PATH = path.join(SOURCE_PATH, './entries') // webpack入口文件

module.exports = {
  ROOT_PATH,
  BUILD_PATH,
  DLL_PATH,
  MODULES_PATH,
  CDN_URI,
  CDN_URL,
  PUBLIC_PATH,
  ENTRY_PATH,
  SOURCE_PATH,
  ASSETS_PATH
}
