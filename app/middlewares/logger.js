
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

  logger.info(
    [
      `[PATH] ${pathname}`,
      `[METHOD] ${ctx.request.method}`,
      `[IP] ${ctx.request.ip}`,
      `[${device.toUpperCase()}] ${browser}:${platform}`,
      `[QUERY] ${JSON.stringify(ctx.query)}`,
      `[BODY] ${JSON.stringify(ctx.request.body)}`,
      `[SESSION] ${JSON.stringify(ctx.session)}`
    ].join('\n')
  )
  await next()
}

export default loggerMiddleware
