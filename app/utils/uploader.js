
import fs from 'fs'
import path from 'path'
import config from 'config'
import oss from 'ali-oss'
import logger from './logger'

const g = (key, defaultValue) => process.env[key] || defaultValue || ''

const store = oss({
  accessKeyId: g('HACKNICAL_ALI_ACCESS_ID'),
  accessKeySecret: g('HACKNICAL_ALI_ACCESS_KEY'),
  bucket: config.get('services.oss.bucket'),
  region: config.get('services.oss.region'),
  internal: false
})

const nextTick = (func, ...params) =>
  process.nextTick(async () => {
    try {
      await func(...params)
    } catch (e) {
      logger.error(e)
    }
  })

export const uploadFile = ({ filePath, prefix = '' }) => {
  if (!fs.statSync(filePath).isFile()) return

  const filename = filePath.split('/').slice(-1)[0]
  const storePrefix = path.join(prefix, filename)

  logger.info(`[OSS:UPLOAD] ${filePath} -> ${storePrefix}`)
  nextTick(store.put.bind(store), storePrefix, filePath)
}

export const uploadFolder = ({ folderPath, prefix = '' }) => {
  if (!fs.statSync(folderPath).isDirectory()) {
    return uploadFile({ filePath: folderPath, prefix })
  }

  const pathes = fs.readdirSync(folderPath)
  for (const targetPath of pathes) {
    const target = path.resolve(folderPath, targetPath)
    uploadFolder({
      folderPath: target,
      prefix: `${prefix}/${targetPath}`
    })
  }
}

export const getUploadUrl = ({ filePath, expires = 60, mimeType }) =>
  store.signatureUrl(filePath, {
    expires,
    method: 'PUT',
    'Content-Type': mimeType
  })

export const getOssObjectUrl = ({ filePath, baseUrl = '' }) =>
  store.generateObjectUrl(filePath, baseUrl)
