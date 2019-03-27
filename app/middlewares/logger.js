
import logger from '../utils/logger'

export const isTargetRequest = (ctx, whiteList) => {
  const method = ctx.request.method.toUpperCase()
  const { url } = ctx.request
  const checked = whiteList.some(option => option.method === method && option.url.test(url))
  if (checked) logger.info(`[WHITELIST][method:${method}] ${url}`)
  return checked
}

const loggerMiddleware = (options = {}) => async (ctx, next) => {
  const { whiteList = [] } = options
  const checkWhite = await isTargetRequest(ctx, whiteList)
  if (checkWhite) return await next()

  const url = ctx.request.URL
  const { pathname } = url
  const {
    device,
    browser,
    platform
  } = ctx.state

  logger.info(`\n[path] ${pathname}\n[method] ${ctx.request.method}\n[${browser}:${platform}:${device}]\n[query] ${JSON.stringify(ctx.query)}\n[body] ${JSON.stringify(ctx.request.body)}\n[session] ${JSON.stringify(ctx.session)}`)
  await next()
}

export default loggerMiddleware
