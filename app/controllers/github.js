/* eslint eqeqeq: "off" */
import config from 'config'
import network from '../services/network'
import { combineReposCommits } from './helper/github'
import { UPDATE_STATUS_TEXT } from '../utils/constant'
import { is, sortBy } from '../utils/helper'
import logger from '../utils/logger'
import Home from './home'
import { getRecords, getLogs } from './helper/stat'

const services = config.get('services.github')

/* ================== private func ==================== */

const _getUser = async (ctx) => {
  const { login } = ctx.params
  const user = await network.github.getUser(login)
  if (!user) {
    return ctx.redirect('/404')
  }
  return user
}

const _getRepositories = async (login, token) => {
  const repositories = await network.github.getUserRepositories(login, token)
  repositories.sort(sortBy.star)
  return repositories
}

const _getContributed = async (login, token) => {
  const repos = await network.github.getUserContributed(login, token)
  repos.sort(sortBy.star)
  return repos
}

const _getCommits = async (login, token) => {
  const commits = await network.github.getUserCommits(login, token)
  const formatCommits = combineReposCommits(commits)
  commits.sort(sortBy.x('totalCommits', parseInt))

  return {
    commits,
    formatCommits
  }
}

/* ================== router handler ================== */

const getAllRepositories = async (ctx, next) => {
  const { githubLogin, githubToken } = ctx.session
  const repos = await network.github.getUserRepositories(githubLogin, githubToken)
  const result = []

  for (const repository of repos) {
    if (!repository.fork) {
      const {
        name,
        language,
        stargazers_count
      } = repository
      result.push({
        name,
        language,
        stargazers_count
      })
    }
  }

  ctx.body = {
    result,
    success: true
  }

  await next()
}

const getUserContributed = async (ctx, next) => {
  const repositories =
    await _getContributed(ctx.params.login, ctx.session.githubToken)
  ctx.body = {
    success: true,
    result: repositories
  }
  await next()
}

const getUserRepositories = async (ctx, next) => {
  const repositories =
    await _getRepositories(ctx.params.login, ctx.session.githubToken)
  ctx.body = {
    success: true,
    result: repositories,
  }
  await next()
}

const getUserCommits = async (ctx, next) => {
  const {
    commits,
    formatCommits
  } = await _getCommits(ctx.params.login, ctx.session.githubToken)

  if (!commits.length) {
    ctx.query.shouldCache = false
  }

  ctx.body = {
    success: true,
    result: {
      commits,
      formatCommits
    }
  }
  await next()
}

const getUserLanguages = async (ctx, next) => {
  const { login } = ctx.params
  const { githubToken } = ctx.session

  const languages = await network.github.getUserLanguages(login, githubToken)
  ctx.body = {
    success: true,
    result: languages
  }
  await next()
}

const getUserOrganizations = async (ctx, next) => {
  const { login } = ctx.params
  const { githubToken } = ctx.session
  const organizations =
    await network.github.getUserOrganizations(login, githubToken)

  ctx.body = {
    success: true,
    result: organizations
  }
  await next()
}

const getUser = async (ctx, next) => {
  const { login } = ctx.params
  const [user, userInfo] = await Promise.all([
    _getUser(ctx),
    network.user.getUser({ login })
  ])

  const result = Object.assign({}, user)
  result.openShare = userInfo.githubShare
  result.shareUrl = `${login}/github?locale=${ctx.session.locale}`
  ctx.body = {
    result,
    success: true,
  }
  await next()
}

const renderGitHubPage = async (ctx) => {
  const { login } = ctx.params
  const { locale, device, isMobile } = ctx.state
  const { githubLogin } = ctx.session
  const title = ctx.__('sharePage.title', login)
  const options = {
    title,
    locale,
    user: {
      login,
      isAdmin: login === githubLogin,
    },
    shareText: isMobile
      ? ctx.__('messages.share.mobileText')
      : ctx.__('messages.share.text')
  }

  Home.cacheControl(ctx)
  await ctx.render(`github/${device}`, options)
}

const getShareLogs = async (ctx) => {
  const { limit } = ctx.query
  const { githubLogin } = ctx.session

  const logs = await getLogs(limit, {
    login: githubLogin,
    type: 'github'
  })

  ctx.body = {
    success: true,
    result: logs
  }
}

const getShareRecords = async (ctx) => {
  const { githubLogin, locale } = ctx.session

  const userInfo = await network.user.getUser({ login: githubLogin })
  const record = await getRecords(100, {
    login: githubLogin,
    type: 'github'
  })

  ctx.body = {
    success: true,
    result: {
      locale,
      login: githubLogin,
      openShare: userInfo.githubShare,
      url: `${githubLogin}/github`,
      ...record
    }
  }
}

const updateFinished = status => status !== 2 && status !== 3

const refreshEnable = (status, lastUpdate) =>
  updateFinished(status) &&
    new Date().getTime() - new Date(lastUpdate).getTime() > services.refreshInterval

const fetchLongtimeAgo = startUpdateAt =>
  startUpdateAt &&
    new Date().getTime() - new Date(startUpdateAt).getTime() > 10 * 60 * 1000

const getUpdateStatus = async (ctx) => {
  const { githubLogin, userId } = ctx.session
  const statusResult = await network.github.getUpdateStatus(githubLogin)
  logger.info(`${githubLogin} update status: ${JSON.stringify(statusResult)}`)
  const {
    status,
    startUpdateAt,
    lastUpdateTime,
  } = statusResult

  const statusCode = parseInt(status, 10)
  if (statusCode === 1 || fetchLongtimeAgo(startUpdateAt)) {
    await Promise.all([
      network.user.updateUser(userId, { initialed: true }),
      network.github.updateUser(githubLogin, { status: 0 })
    ])
  }
  const messageKey = UPDATE_STATUS_TEXT[statusCode]

  const result = {
    status,
    lastUpdateTime,
    finished: updateFinished(statusCode),
    refreshing: !updateFinished(statusCode),
    refreshEnable: refreshEnable(statusCode, lastUpdateTime),
  }
  ctx.body = {
    result,
    success: true,
    message: messageKey ? ctx.__(messageKey) : '',
  }
}

const updateUserData = async (ctx) => {
  const { githubToken, githubLogin } = ctx.session
  await network.github.updateUserData(githubLogin, githubToken)

  ctx.body = {
    success: true,
    message: ctx.__('messages.update.pending')
  }
}

const getZen = async (ctx) => {
  const { githubToken } = ctx.session
  const val = await network.github.getZen(githubToken)
  const result = is.object(val) ? '' : val

  ctx.body = {
    result,
    success: true
  }
}

const getOctocat = async (ctx) => {
  const result = await network.github.getOctocat()
  ctx.body = {
    result,
    success: true
  }
}

const getUserHotmap = async (ctx, next) => {
  const { login } = ctx.params
  const { locale } = ctx.session
  const result = await network.github.getHotmap(login, locale)

  ctx.body = {
    result,
    success: true,
  }
  await next()
}

export default {
  renderGitHubPage,
  getAllRepositories,
  // github info
  getUser,
  getUserHotmap,
  getUserCommits,
  getUserLanguages,
  getUserContributed,
  getUserRepositories,
  getUserOrganizations,
  /* ===== refresh & update ====== */
  updateUserData,
  getUpdateStatus,
  /* ========== */
  getZen,
  getOctocat,
  /* ========== */
  getShareRecords,
  getShareLogs,
}
