
import logger from '../utils/logger'

const validateQueryLocale = (locale) => {
  const language = locale
  if (!language) return null
  if (/^en/.test(language)) return 'en'
  if (/^zh/.test(language)) return 'zh'
  return null
}

const formatLocale = locale => locale.split(/-|_/)[0]

const localeMiddleware = () => async (ctx, next) => {
  const queryLocale = validateQueryLocale(ctx.query.locale)
  if (queryLocale) {
    ctx.session.locale = queryLocale
  } else if (!ctx.session.locale) {
    const locale = formatLocale(ctx.__getLocale())
    ctx.session.locale = locale || 'zh'
  }

  const sessionLocale = ctx.session.locale
  ctx.state.locale = sessionLocale
  ctx.state.description = ctx.__('description')
  ctx.state.keywords = ctx.__('keywords')

  await next()
  logger.info(`[LOCALE][${ctx.state.locale}]`)
}

export default localeMiddleware
