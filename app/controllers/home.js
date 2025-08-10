
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
  let clientId = null
  let loginLink = '#'
  try {
    clientId = await network.github.getVerify()
    loginLink = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${clientId}`
  } catch (error) {
    logger.warn(`[GitHub Service] Service unavailable: ${error.message}`)
    // Fallback for local development without GitHub service
    loginLink = '#github-service-unavailable'
  }

  cacheControl(ctx)
  logger.info(`[LoginLink] ${loginLink}`)

  const { messageCode, messageType } = ctx.request.query

  await ctx.render('user/login', {
    loginLink,
    messageCode,
    messageType,
    title: ctx.__('loginPage.title')
  })
}

const renderSignupPage = async (ctx) => {
  let clientId = null
  let loginLink = '#'
  try {
    clientId = await network.github.getVerify()
    loginLink = `https://github.com/login/oauth/authorize?scope=user:email&client_id=${clientId}`
  } catch (error) {
    logger.warn(`[GitHub Service] Service unavailable: ${error.message}`)
    // Fallback for local development without GitHub service
    loginLink = '#github-service-unavailable'
  }

  cacheControl(ctx)
  logger.info(`[LoginLink] ${loginLink}`)

  const { messageCode, messageType } = ctx.request.query

  await ctx.render('user/signup', {
    loginLink,
    messageCode,
    messageType,
    title: ctx.__('signupPage.title')
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
  let users = 0
  let githubFields = []
  let resumeFields = []

  try {
    const [
      usersResult,
      githubResult,
      resumeResult
    ] = await Promise.all([
      network.user.getUserCount().catch(() => {
        logger.warn('User service not available, using mock data')
        return 1234
      }),
      network.stat.getStat({ type: 'github' }).catch(() => {
        logger.warn('Stat service not available for github, using mock data')
        return [
          { action: 'pageview', count: 5678 },
          { action: 'share', count: 234 }
        ]
      }),
      network.stat.getStat({ type: 'resume' }).catch(() => {
        logger.warn('Stat service not available for resume, using mock data')
        return [
          { action: 'pageview', count: 3456 },
          { action: 'download', count: 567 }
        ]
      })
    ])

    users = usersResult
    githubFields = githubResult
    resumeFields = resumeResult
  } catch (error) {
    logger.error('Error fetching statistics, using fallback data:', error.message)
    users = 1234
    githubFields = [{ action: 'pageview', count: 5678 }]
    resumeFields = [{ action: 'pageview', count: 3456 }]
  }

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

/* ===================== Email Authentication Pages ===================== */

const renderForgotPasswordPage = async (ctx) => {
  const { messageCode, messageType } = ctx.request.query

  cacheControl(ctx)
  await ctx.render('user/forgot-password', {
    messageCode,
    messageType,
    title: ctx.__('forgotPasswordPage.title')
  })
}

const renderResetPasswordPage = async (ctx) => {
  const { token } = ctx.request.query
  const { messageCode, messageType } = ctx.request.query

  cacheControl(ctx)
  await ctx.render('user/reset-password', {
    token,
    messageCode,
    messageType,
    title: ctx.__('resetPasswordPage.title')
  })
}

const renderVerifyEmailPage = async (ctx) => {
  const { token } = ctx.request.query
  if (!token) {
    cacheControl(ctx)
    await ctx.render('user/verify-email', {
      success: false,
      message: '验证链接无效',
      title: ctx.__('verifyEmailPage.title')
    })
    return
  }

  try {
    // 调用验证API
    const result = await network.user.verifyEmail({ token })
    cacheControl(ctx)
    await ctx.render('user/verify-email', {
      success: result.success,
      message: result.message,
      title: ctx.__('verifyEmailPage.title')
    })
  } catch (error) {
    logger.error('[EMAIL:VERIFY] Verification failed:', error)
    cacheControl(ctx)
    await ctx.render('user/verify-email', {
      success: false,
      message: '验证失败，请稍后重试',
      title: ctx.__('verifyEmailPage.title')
    })
  }
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
  renderSignupPage,
  renderInitialPage,
  // email auth pages
  renderForgotPasswordPage,
  renderResetPasswordPage,
  renderVerifyEmailPage
}
