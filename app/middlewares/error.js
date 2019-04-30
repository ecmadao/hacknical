
import logger from '../utils/logger'
import { ERRORS } from '../utils/error'
import notify from '../services/notify'
import Home from '../controllers/home'

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
      return await ctx.redirect('/api/user/logout')
    }
    return await ctx.redirect(`/${githubLogin}`)
  }

  if (ctx.status === 404) {
    return ctx.redirect('/404')
  }

  return false
}

const render500 = async (ctx, err) => {
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
        `[Server status] ${ctx.status}`,
        '[Server session]',
        printer(ctx.session),
        `[IP] ${ctx.request.ip}`
      ].join('\n')
    }
  })

  try {
    await Home.render500Page(ctx)
  } catch (e) {
    logger.error(e)
    return ctx.redirect('/500')
  }
}

const catchError = () => async (ctx, next) => {
  try {
    await next()
    await redirect(ctx)
  } catch (err) {
    logger.error(err)

    const { message, errorCode } = err
    const { pathname } = ctx.request.URL

    switch (errorCode) {
      case ERRORS.LoginError:
        return await ctx.redirect('/')
      case ERRORS.ParamsError:
      case ERRORS.NotfoundError:
        ctx.body = {
          message,
          success: false
        }
        return
      case ERRORS.ServerError:
        if (/^\/api\//.test(pathname)) {
          ctx.body = {
            message,
            success: false
          }
          return
        }
        break
      default:
        break
    }

    await render500(ctx, err)
  }
}

export default catchError
