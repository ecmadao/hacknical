
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
    logger.error(err)
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
    logger.error(e)
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
  loginByGitHub,
  initialFinished,
  // notify
  markNotifies,
  voteNotify,
  getUnreadNotifies
}
