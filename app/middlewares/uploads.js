import fs from 'fs'
import path from 'path'
import { getLocalUploadPath, isLocalStorage } from '../utils/uploader'

const enabled = () => isLocalStorage

export default () => async (ctx, next) => {
  if (!enabled() || ctx.method !== 'PUT' || !ctx.path.startsWith('/uploads/')) {
    return next()
  }

  const target = getLocalUploadPath(ctx.path.replace(/^\/uploads\//, ''))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  const output = fs.createWriteStream(target)
  await new Promise((resolve, reject) => {
    ctx.req.pipe(output)
    ctx.req.on('error', reject)
    output.on('finish', resolve)
    output.on('error', reject)
  })
  ctx.status = 200
  ctx.body = { success: true }
}
