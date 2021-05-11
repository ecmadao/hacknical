
import network from '../services/network'
import getLanguages from '../config/languages'
import logger from '../utils/logger'
import notify from '../services/notify'
import request from 'request'

const cacheControl = (ctx) => {
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  ctx.set('Pragma', 'no-cache')
  ctx.set('Expires', 0)
}

const renderLandingPage = async (ctx) => {
  const clientId = await network.github.getVerify()

  cacheControl(ctx)
  const loginLink = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${clientId}`
  logger.info(`[LoginLink] ${loginLink}`)

  const { messageCode, messageType } = ctx.request.query

  await ctx.render('user/login', {
    loginLink,
    messageCode,
    messageType,
    title: ctx.__('loginPage.title')
  })
}

const render500Page = async (ctx) => {
  cacheControl(ctx)
  await ctx.render('error/500', {
    text: ctx.__('500Page.text'),
    title: ctx.__('500Page.title'),
    redirectText: ctx.__('500Page.redirectText')
  })
}

const render404Page = async (ctx) => {
  cacheControl(ctx)
  await ctx.render('error/404', {
    text: ctx.__('404Page.text'),
    title: ctx.__('404Page.title'),
    redirectText: ctx.__('404Page.redirectText')
  })
}

const renderDashboard = async (ctx) => {
  const { device, browser, platform } = ctx.state
  const { githubLogin, userId } = ctx.session
  const { login, dashboardRoute = 'visualize' } = ctx.params
  const user = await network.user.getUser({ userId })

  logger.debug(`githubLogin: ${githubLogin}, userId: ${userId}`)
  logger.debug(user)

  if (!user || !userId) {
    return ctx.redirect('/api/user/logout')
  }

  if (!user.initialed) {
    return ctx.redirect('/initial')
  }
  notify.slack({
    mq: ctx.mq,
    data: {
      data: `【USAGE:${githubLogin}】${device.toUpperCase()}:${platform.toUpperCase()}:${browser.toUpperCase()}`
    }
  })

  cacheControl(ctx)
  await ctx.render('user/dashboard', {
    dashboardRoute,
    login: githubLogin,
    isAdmin: login === githubLogin,
    title: ctx.__('dashboard.title', githubLogin)
  })
}

const renderInitialPage = async (ctx) => {
  const { githubLogin, userId } = ctx.session
  logger.debug(`githubLogin: ${githubLogin}, userId: ${userId}`)
  const user = await network.user.getUser({ userId })

  logger.debug(user)

  if (user.initialed) {
    return ctx.redirect(`/${githubLogin}`)
  }

  const title = ctx.__('initialPage.title', githubLogin)
  cacheControl(ctx)
  await ctx.render('user/initial', {
    title,
    login: githubLogin
  })
}

const combineStat = stats => stats.reduce((pre, cur) => {
  pre[cur.action] = (pre[cur.action] || 0) + cur.count
  return pre
}, {})

const statistic = async (ctx) => {
  const [
    users,
    githubFields,
    resumeFields
  ] = await Promise.all([
    network.user.getUserCount(),
    network.stat.getStat({ type: 'github' }),
    network.stat.getStat({ type: 'resume' })
  ])

  const github = combineStat(githubFields || [])
  const resume = combineStat(resumeFields || [])

  ctx.body = {
    success: true,
    result: {
      users,
      github,
      resume
    }
  }
}

const languages = async (ctx) => {
  const avaliableLanguages = getLanguages(ctx.state.locale)

  ctx.body = {
    success: true,
    result: avaliableLanguages
  }
}

const getIcon = async (ctx, next) => {
  const { url, size } = ctx.query
  if (!url) {
    return ctx.body = {
      success: true,
      result: ''
    }
  }

  let iconUrl = ''
  const area = size ** 2

  try {
    const res = await network.besticon.getIcon(url)
    logger.debug(`[ICON] ${url} - ${JSON.stringify(res)}`)
    let icon = null

    for (const item of res.icons) {
      if (icon === null) icon = item

      const diff = Math.abs(area - (item.width ** 2))
      if (diff < Math.abs(area - (icon.width ** 2))) {
        icon = item
      }

      if (diff === 0) break
    }

    if (icon) iconUrl = request(icon.url)
  } catch (e) {
    logger.error(e)
    iconUrl = ''
  } finally {
    ctx.set('Content-Type', 'image/png')
    ctx.body = iconUrl
  }

  await next()
}

export default {
  getIcon,
  statistic,
  languages,
  cacheControl,
  render404Page,
  render500Page,
  renderDashboard,
  renderLandingPage,
  renderInitialPage
}
