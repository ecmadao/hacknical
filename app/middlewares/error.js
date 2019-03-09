
import logger from '../utils/logger'
import notify from '../services/notify'

const catchError = () => async (ctx, next) => {
  try {
    await next()
    const { url } = ctx

    if (/^\/dashboard/g.test(url)) {
      logger.info(`[OLD URL REQUEST][${ctx.status}][${url}]`)
      const { githubLogin } = ctx.session
      if (!githubLogin) {
        return await ctx.redirect('/user/logout')
      }
      return await ctx.redirect(`/${githubLogin}`)
    }

    if (ctx.status === 404) {
      const login = url.split('/')[0]
      await ctx.redirect(`/${login}`)
    }
  } catch (err) {
    logger.error(err)

    notify.slack({
      mq: ctx.mq,
      data: {
        type: 'error',
        data: [
          `[Error] ${err.stack}`,
          `[Server status] ${ctx.status}`,
          `[Server session] ${JSON.stringify(ctx.session)}`
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
