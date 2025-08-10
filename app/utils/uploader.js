
import fs from 'fs'
import path from 'path'
import config from 'config'
import logger from './logger'

const g = (key, defaultValue) => process.env[key] || defaultValue || ''

// 在开发环境中，如果没有配置 OSS，则使用 null
let store = null;
let OSSClient = null;

// 只有在有 OSS 配置时才导入
const accessKeyId = g('HACKNICAL_ALI_ACCESS_ID');
const accessKeySecret = g('HACKNICAL_ALI_ACCESS_KEY');

if (accessKeyId && accessKeySecret) {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    import('ali-oss').then((aliOSS) => {
      OSSClient = aliOSS.default;
      store = OSSClient({
        accessKeyId,
        accessKeySecret,
        bucket: config.get('services.oss.bucket'),
        region: config.get('services.oss.region'),
        internal: false
      });
      logger.info('[OSS] OSS client initialized successfully');
    }).catch((err) => {
      logger.error('[OSS] Failed to initialize OSS client:', err.message);
    });
  } catch (err) {
    logger.error('[OSS] Failed to initialize OSS client:', err.message);
  }
} else {
  logger.warn('[OSS] OSS credentials not configured, file upload will be disabled');
}

const nextTick = (func, ...params) =>
  process.nextTick(async () => {
    try {
      await func(...params)
    } catch (e) {
      logger.error(e)
    }
  })

export const uploadFile = ({ filePath, prefix = '' }) => {
  if (!store) {
    logger.warn('[OSS] OSS client not available, skipping file upload');
    return;
  }
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

export const getUploadUrl = ({ filePath, expires = 60, mimeType }) => {
  if (!store) {
    logger.warn('[OSS] OSS client not available, returning empty URL');
    return '';
  }
  return store.signatureUrl(filePath, {
    expires,
    method: 'PUT',
    'Content-Type': mimeType
  });
}

export const getOssObjectUrl = ({ filePath, baseUrl = '' }) => {
  if (!store) {
    logger.warn('[OSS] OSS client not available, returning empty URL');
    return '';
  }
  return store.generateObjectUrl(filePath, baseUrl);
}
