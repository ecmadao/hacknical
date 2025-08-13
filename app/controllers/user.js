
import network from '../services/network'
import getCacheKey from './helper/cacheKey'
import logger from '../utils/logger'
import notify from '../services/notify'

const clearCache = async (ctx, next) => {
  const cacheKey = getCacheKey(ctx)
  ctx.query.deleteKeys = [
    cacheKey('user-repositories', {
      query: ['login']
    }),
    cacheKey('user-contributed', {
      query: ['login']
    }),
    cacheKey('allRepositories', {
      query: ['login']
    }),
    cacheKey('user-github', {
      query: ['login']
    }),
    cacheKey('user-hotmap', {
      query: ['login'],
      session: ['locale']
    }),
    cacheKey('user-organizations', {
      query: ['login'],
    }),
    cacheKey('user-commits', {
      query: ['login'],
    })
  ]
  ctx.body = {
    success: true
  }
  await next()
}

const logout = async (ctx) => {
  ctx.session.userId = null
  ctx.session.githubToken = null
  ctx.session.githubLogin = null

  const { messageCode, messageType } = ctx.request.query

  ctx.redirect(`/?messageCode=${messageCode}&messageType=${messageType}`)
}

const loginByAuth0 = async (ctx) => {
  const { code } = ctx.request.query

  if (!code) {
    logger.error('[AUTH0:LOGIN] no authorization code provided')
    return ctx.redirect('/api/user/logout?messageCode=auth0&messageType=error')
  }

  try {
    const [
      userTokenResponse,
      managementTokenResponse
    ] = await Promise.all([
      network.auth0.getAccessToken(code),
      network.auth0.getManagementToken()
    ])
    const { access_token: userToken } = userTokenResponse
    const { access_token: managementToken } = managementTokenResponse
    const userInfoResponse = await network.auth0.getUserInfo(userToken)

    logger.debug(`[AUTH0:LOGIN] User info: ${JSON.stringify(userInfoResponse)}`)

    const fullUserInfo = await network.auth0.getUserById(userInfoResponse.sub, managementToken)
    // Find GitHub identity to get the access token
    const githubIdentity = fullUserInfo.identities && fullUserInfo.identities.find(id => id.provider === 'github')
    if (!githubIdentity) {
      logger.error(`[AUTH0:LOGIN] cannot found github identity for ${JSON.stringify(fullUserInfo)}`)
      return ctx.redirect('/api/user/logout?messageCode=github&messageType=error')
    }

    // Extract GitHub access token from the identity
    const githubToken = githubIdentity.access_token
    if (!githubToken) {
      logger.error(`[AUTH0:LOGIN] cannot found github token for ${JSON.stringify(fullUserInfo)}`)
      return ctx.redirect('/api/user/logout?messageCode=github&messageType=error')
    }

    // Get GitHub user info using the GitHub token
    const githubUserInfo = await network.github.getLogin(githubToken)
    logger.debug(`[AUTH0:LOGIN] GitHub user info: ${JSON.stringify(githubUserInfo)}`)
    if (!githubUserInfo.login) {
      logger.error(`[AUTH0:LOGIN] cannot found github login for ${JSON.stringify(userInfoResponse)}`)
      return ctx.redirect('/api/user/logout?messageCode=github&messageType=error')
    }

    // Set GitHub session data
    ctx.session.githubToken = githubToken
    ctx.session.githubLogin = githubUserInfo.login
    ctx.session.githubAvator = githubUserInfo.avator || githubUserInfo.avatar_url

    // Create or update user
    const user = await network.user.createUser(githubUserInfo)
    notify.slack({
      mq: ctx.mq,
      data: {
        type: 'login',
        data: `<https://github.com/${githubUserInfo.login}|${githubUserInfo.login}> logged in via Auth0!`
      }
    })

    logger.info(`[AUTH0:LOGIN] ${JSON.stringify(user)}`)
    ctx.session.userId = user.userId

    // Update user data if already initialized
    if (user && user.initialed) {
      network.github.updateUserData(ctx.session.githubLogin, githubToken)
    }

    return ctx.redirect(`/${ctx.session.githubLogin}`)
  } catch (err) {
    logger.error(`[AUTH0:LOGIN] ${err.stack || err.message || err}`)
    return ctx.redirect('/api/user/logout?messageCode=auth0&messageType=error')
  }
}

const loginByGitHub = async (ctx) => {
  const { code } = ctx.request.query
  try {
    const githubToken = await network.github.getToken(code)
    const userInfo = await network.github.getLogin(githubToken)
    logger.debug(userInfo)

    if (userInfo.login) {
      ctx.session.githubToken = githubToken
      ctx.session.githubLogin = userInfo.login
      ctx.session.githubAvator = userInfo.avator

      const user = await network.user.createUser(userInfo)
      notify.slack({
        mq: ctx.mq,
        data: {
          type: 'login',
          data: `<https://github.com/${userInfo.login}|${userInfo.login}> logined!`
        }
      })

      logger.info(`[USER:LOGIN] ${JSON.stringify(user)}`)
      ctx.session.userId = user.userId
      if (user && user.initialed) {
        network.github.updateUserData(ctx.session.githubLogin, githubToken)
      }

      return ctx.redirect(`/${ctx.session.githubLogin}`)
    }

    return ctx.redirect('/api/user/logout')
  } catch (err) {
    logger.error(`[GITHUB:LOGIN] ${err.stack || err.message || err}`)
    return ctx.redirect('/api/user/logout?messageCode=github&messageType=error')
  }
}

const initialFinished = async (ctx) => {
  const { userId } = ctx.session

  await Promise.all([
    network.user.updateUser(userId, { initialed: true }),
    network.stat.putStat({
      type: 'github',
      action: 'count'
    })
  ])

  ctx.body = {
    success: true,
    result: ''
  }
}

const getGitHubSections = async (ctx) => {
  const { login } = ctx.query
  const user = await network.user.getUser({
    login: login || ctx.session.githubLogin
  })
  const resumeInfo = await network.user.getResumeInfo({ userId: user.userId })

  ctx.body = {
    result: resumeInfo.githubSections,
    success: true
  }
}

const getUserInfo = async (ctx) => {
  const { login } = ctx.query
  const user = await network.user.getUser({
    login: login || ctx.session.githubLogin
  })

  ctx.body = {
    result: user,
    success: true
  }
}

const patchUserInfo = async (ctx) => {
  const { userId } = ctx.session
  const { info } = ctx.request.body

  await network.user.updateUser(userId, info)
  ctx.body = {
    success: true
  }
}

const getUnreadNotifies = async (ctx) => {
  const { userId, locale } = ctx.session

  let datas = []
  try {
    datas = await network.stat.getUnreadNotifies(userId, locale)
  } catch (e) {
    logger.error(e.stack || e)
  } finally {
    ctx.body = {
      result: datas,
      success: true
    }
  }
}

const markNotifies = async (ctx) => {
  const { userId } = ctx.session
  const { messageIds } = ctx.request.body

  await network.stat.markNotifies(userId, messageIds)
  ctx.body = {
    success: true
  }
}

const voteNotify = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const { messageId } = ctx.params

  const { vote } = ctx.request.body
  let mark = parseInt(vote, 10)
  if (Number.isNaN(mark)) mark = 0

  const type = mark ? 'Upvote' : 'Downvote'

  notify.slack({
    mq: ctx.mq,
    data: {
      data: `${type.toUpperCase()} ${messageId} by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  })

  await network.stat.voteNotify(userId, {
    messageId,
    vote: mark
  })

  ctx.body = {
    success: true
  }
}

export default {
  // user
  logout,
  clearCache,
  getUserInfo,
  getGitHubSections,
  patchUserInfo,
  initialFinished,
  // notify
  markNotifies,
  voteNotify,
  getUnreadNotifies,
  // login
  loginByGitHub,
  loginByAuth0
}
