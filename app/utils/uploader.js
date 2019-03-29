
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

export const uploadFile = async ({ filePath, prefix = '' }) => {
  if (!fs.statSync(filePath).isFile()) return

  const filename = filePath.split('/').slice(-1)[0]
  const storePrefix = /\/$/.test(prefix)
    ? `${prefix}${filename}` : `${prefix}/${filename}`

  logger.info(`[OSS:UPLOAD] ${filePath} -> ${storePrefix}`)
  await store.put(
    storePrefix,
    filePath
  )
}

export const upload = async ({ folderPath, prefix = '' }) => {
  if (!fs.statSync(folderPath).isDirectory()) {
    return await uploadFile({ filePath: folderPath, prefix })
  }

  const pathes = fs.readdirSync(folderPath)
  for (const targetPath of pathes) {
    const target = path.resolve(folderPath, targetPath)
    await upload({
      folderPath: target,
      prefix: `${prefix}/${targetPath}`
    })
  }
}

export const uploadFolder = async ({ folderPath, prefix = '' }) => {
  process.nextTick(async () => {
    await upload({
      prefix,
      folderPath
    })
  })
}
