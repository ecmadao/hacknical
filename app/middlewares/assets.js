/* eslint global-require: "off" */

import path from 'path'
import fs from 'fs'
import PATH from '../../config/path'
import logger from '../utils/logger'

let manifest = {}
const manifestPaths = [
  // Production deployments download the manifest into app/config.
  path.resolve(__dirname, '../config', 'webpack-assets.json'),
  // Local builds emit it alongside the public assets.
  path.resolve(__dirname, '../../public/assets', 'webpack-assets.json')
]

const manifestPath = manifestPaths.find(filePath => fs.existsSync(filePath))

if (manifestPath) {
  manifest = require(`${manifestPath}`)
}

const getAssetName = asset => manifest[asset]

const assetsMiddleware = (assetsName) => {
  const finalName = assetsName.split('/').slice(-1)[0]
  const sections = finalName.split('.')
  // So file base name should not has dot
  const name = sections[0]
  const type = sections.slice(-1)[0]
  const publicAsset = getAssetName(name)

  let result = ''
  if (!publicAsset || !publicAsset[type]) {
    result = `${PATH.CDN_URL}/${assetsName}`
  } else {
    result = publicAsset[type]
  }
  logger.info(`[ASSETS] ${result}`)
  return result
}

export default assetsMiddleware
