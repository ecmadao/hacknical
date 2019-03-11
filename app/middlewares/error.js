
import logger from '../utils/logger'
import notify from '../services/notify'

const printer = object => Object.keys(object).reduce((list, key) => {
  if (/^_/.test(key)) return list
  const rawData = object[key]
  const data = typeof rawData === 'object' ? JSON.stringify(rawData) : rawData
  list.push(`> ${key}: ${data}`)
  return list
}, []).join('\n')

const redirect = async (ctx) => {
  const { url } = ctx

  if (/^\/dashboard/g.test(url)) {
    logger.info(`[OLD URL REQUEST][${ctx.status}][${url}]`)
    const { githubLogin } = ctx.session
    if (!githubLogin) {
      return await ctx.redirect('/user/logout')
    }
    return await ctx.redirect(`/${githubLogin}`)
  }
}

const catchError = () => async (ctx, next) => {
  try {
    await next()
    const { url } = ctx

    await redirect(ctx)

    if (ctx.status === 404) {
      const login = url.split('/')[0]
      await ctx.redirect(`/${login}`)
    }
  } catch (err) {
    await redirect(ctx)
    logger.error(err)

    notify.slack({
      mq: ctx.mq,
      data: {
        type: 'error',
        data: [
          '[Error]',
          err.stack,
          '[Request url]',
          printer({
            href: ctx.request.href,
            method: ctx.request.method,
            origin: ctx.request.header.origin || ctx.request.origin,
            querystring: ctx.request.querystring
          }),
          '[Server status]',
          ctx.status,
          '[Server session]',
          printer(ctx.session)
        ].join('\n')
      }
    })

    await ctx.render('error/500', {
      text: ctx.__('500Page.text'),
      title: ctx.__('500Page.title'),
      redirectText: ctx.__('500Page.redirectText')
    })
  }
}

export default catchError
