
import network from '../services/network'
import getLanguages from '../config/languages'
import logger from '../utils/logger'
import notify from '../services/notify'

const cacheControl = (ctx) => {
  ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  ctx.set('Pragma', 'no-cache')
  ctx.set('Expires', 0)
}

const renderLandingPage = async (ctx) => {
  const { locale } = ctx.state
  const languages = getLanguages(locale)
  const clientId = await network.github.getVerify()

  cacheControl(ctx)

  await ctx.render('user/login', {
    clientId,
    languages,
    languageId: locale,
    title: ctx.__('loginPage.title'),
    login: ctx.__('loginPage.login'),
    about: ctx.__('loginPage.about'),
    languageText: ctx.__('language.text'),
    loginText: ctx.__('loginPage.loginText'),
    loginButtonText: ctx.__('loginPage.loginButtonText'),
    statistic: {
      resumes: ctx.__('loginPage.statistic.resumes'),
      developers: ctx.__('loginPage.statistic.developers'),
      githubPageview: ctx.__('loginPage.statistic.githubPageview'),
      resumePageview: ctx.__('loginPage.statistic.resumePageview')
    }
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
    return ctx.redirect('/user/logout')
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

export default {
  statistic,
  languages,
  cacheControl,
  render404Page,
  render500Page,
  renderDashboard,
  renderLandingPage,
  renderInitialPage
}
