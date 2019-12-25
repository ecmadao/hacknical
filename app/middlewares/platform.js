
import logger from '../utils/logger'

const platformMiddleware = () => async (ctx, next) => {
  const { userAgent } = ctx
  ctx.state.browser = userAgent.browser
  ctx.state.platform = userAgent.platform
  ctx.state.isMobile = userAgent.isMobile
  ctx.state.device = userAgent.isMobile ? 'mobile' : 'desktop'

  await next()
  const { githubLogin } = ctx.session
  logger.info(
    `[${userAgent.browser}][${userAgent.platform}]${
      userAgent.isMobile ? '[Mobile]' : '[Desktop]'
    }${githubLogin ? `[LOGIN:${githubLogin}]` : ''}`
  )
}

export default platformMiddleware
