
import network from '../services/network'
import getCacheKey from './helper/cacheKey'
import logger from '../utils/logger'
import notify from '../services/notify'
import { randomBytes, timingSafeEqual } from 'node:crypto'
import * as githubOAuth from '../services/github-oauth'

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
  ctx.session = null
  const { messageCode = '', messageType = '' } = ctx.request.query
  ctx.redirect(`/?${new URLSearchParams({ messageCode, messageType })}`)
}

const startGitHubLogin = async (ctx) => {
  ctx.set('Cache-Control', 'no-store')
  if (!githubOAuth.isConfigured()) {
    ctx.status = 503
    ctx.body = {
      success: false,
      code: 'GITHUB_OAUTH_UNAVAILABLE',
      message: 'GitHub 登录尚未配置，请设置 GITHUB_OAUTH_CLIENT_ID 和 GITHUB_OAUTH_CLIENT_SECRET。'
    }
    return
  }
  const state = randomBytes(32).toString('hex')
  ctx.session.githubOAuth = { state, createdAt: Date.now() }
  ctx.redirect(githubOAuth.authorizationUrl(state))
}

const loginByGitHub = async (ctx) => {
  ctx.set('Cache-Control', 'no-store')
  const { code, state, error } = ctx.request.query
  const pending = ctx.session.githubOAuth
  delete ctx.session.githubOAuth

  const expected = pending && pending.state
  const validState = typeof state === 'string' && typeof expected === 'string'
    && Buffer.byteLength(state) === Buffer.byteLength(expected)
    && timingSafeEqual(Buffer.from(state), Buffer.from(expected))
  const age = pending && Date.now() - pending.createdAt
  if (!validState || age < 0 || age > 10 * 60 * 1000 || !Number.isFinite(age)) {
    ctx.status = 400
    ctx.body = { success: false, code: 'INVALID_OAUTH_STATE', message: '登录验证已失效，请返回首页重新登录。' }
    return
  }
  if (error || typeof code !== 'string' || !code) {
    return ctx.redirect('/?messageCode=github&messageType=error')
  }

  try {
    const { accessToken: githubToken, expiresAt } = await githubOAuth.exchangeCode(code)
    const userInfo = await githubOAuth.getLogin(githubToken)
    const user = await network.user.createUser(userInfo)
    // Rotate the session ID after successful login.
    ctx.session = {
      locale: ctx.session.locale,
      userId: user.userId,
      githubToken,
      githubTokenExpiresAt: expiresAt,
      githubLogin: userInfo.login,
      githubAvator: userInfo.avatar_url,
    }
    if (expiresAt) ctx.session.maxAge = Math.min(ctx.session.maxAge, expiresAt - Date.now())
    await ctx.session.regenerate()
    if (user.initialed) {
      network.github.updateUserData(userInfo.login, githubToken)
        .catch(() => logger.warn('[GITHUB:LOGIN] Profile refresh failed'))
    }
    logger.info(`[GITHUB:LOGIN] ${userInfo.login}`)
    return ctx.redirect(`/${userInfo.login}`)
  } catch (err) {
    // Provider responses may contain credentials; do not log their bodies.
    logger.error('[GITHUB:LOGIN] OAuth exchange or user creation failed')
    return ctx.redirect('/?messageCode=github&messageType=error')
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
  startGitHubLogin,
  loginByGitHub
}
