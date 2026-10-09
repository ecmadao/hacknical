
import fs from 'fs'
import path from 'path'
import config from 'config'
import logger from './logger'
import PATH from '../../config/path'

const g = (key, defaultValue) => process.env[key] || defaultValue || ''

const ossConfig = config.get('services.oss')
const localDriver = ossConfig.driver === 'local'
  || !g('HACKNICAL_ALI_ACCESS_ID')
  || !g('HACKNICAL_ALI_ACCESS_KEY')
const store = localDriver
  ? null
  : require('ali-oss')({
    accessKeyId: g('HACKNICAL_ALI_ACCESS_ID'),
    accessKeySecret: g('HACKNICAL_ALI_ACCESS_KEY'),
    bucket: ossConfig.bucket,
    region: ossConfig.region,
    internal: false
  })

const localUploadRoot = path.resolve(
  PATH.ROOT_PATH,
  config.get('storage.uploadsPath') || 'public/uploads'
)

const normalizeLocalPath = filePath => String(filePath || '').replace(/^\/+/, '')
const localUrl = (filePath, baseUrl = '') => {
  const normalized = normalizeLocalPath(filePath)
  if (normalized.startsWith('uploads/')) return `/${normalized}`
  return `${baseUrl || ossConfig.url || '/uploads'}/${normalized}`
}

export const isLocalStorage = localDriver

const nextTick = (func, ...params) =>
  process.nextTick(async () => {
    try {
      await func(...params)
    } catch (e) {
      logger.error(e.stack || e)
    }
  })

export const uploadFile = ({ filePath, prefix = '' }) => {
  if (!fs.statSync(filePath).isFile()) return

  if (localDriver) return

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
  (localDriver
    ? localUrl(filePath)
    : store.signatureUrl(filePath, {
      expires,
      method: 'PUT',
      'Content-Type': mimeType
    }))

export const getOssObjectUrl = ({ filePath, baseUrl = '' }) =>
  (localDriver
    ? localUrl(filePath, baseUrl)
    : store.generateObjectUrl(filePath, baseUrl))

export const getLocalUploadPath = (filePath) => {
  const normalized = normalizeLocalPath(filePath)
  const result = path.resolve(localUploadRoot, normalized)
  if (!result.startsWith(`${localUploadRoot}${path.sep}`)) {
    throw new Error('Invalid upload path')
  }
  return result
}
