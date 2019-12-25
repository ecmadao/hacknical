
import logger from '../../utils/logger'
import notify from '../../services/notify'
import { getValue } from '../../utils/helper'
import network from '../../services/network'

const updateViewData = options => async (ctx, login) => {
  const { platform, browser, device } = ctx.state
  const {
    type = null,
  } = options

  const record = {
    type,
    login,
    platform,
    browser: browser || ''
  }

  await network.stat.putRecords(record)
  if (type) {
    await network.stat.putStat({
      type,
      action: 'pageview'
    })
    notify.slack({
      mq: ctx.mq,
      data: {
        type: 'view',
        data: `【${type.toUpperCase()}:${login}】${device.toUpperCase()}:${platform.toUpperCase()}:${browser.toUpperCase()}`
      }
    })
  }
  logger.info(`[${type.toUpperCase()}:VIEW] ${login} - ${JSON.stringify(record)}`)
}

const collectGithubRecord = (key = 'params.login') => async (ctx, next) => {
  await next()
  const login = getValue(ctx, key)
  const { githubLogin } = ctx.session

  // make sure that admin user's visit will not be collected.
  if (githubLogin !== login) {
    updateViewData({ type: 'github' })(ctx, login)
  }
}

const getUser = async (ctx, source) => {
  const value = getValue(ctx, source)
  const key = source.split('.').slice(-1)[0]

  let user
  if (key === 'hash') {
    const resumeInfo = await network.user.getResumeInfo({ hash: value })
    user = await network.user.getUser({ userId: resumeInfo.userId })
  } else {
    user = await network.user.getUser({ [key]: value })
  }

  return user
}

const dataRecord = async (ctx, key, record) => {
  const { notrace } = ctx.query

  const user = await getUser(ctx, key)
  const login = user.githubLogin

  const { githubLogin, fromDownload } = ctx.session
  const isAdmin = user && login === githubLogin

  const canRecord =
    !fromDownload && (!isAdmin && (notrace !== true || notrace !== 'true' || notrace === 'false')) && user

  if (canRecord) {
    await record(ctx, login)
  }
}

const collectResumeRecordByHash = (key = 'params.hash') => async (ctx, next) => {
  await next()
  dataRecord(ctx, key, updateViewData({ type: 'resume' }))
}

const updateLogData = options => async (ctx, login) => {
  try {
    const { ip, ...others } = options
    let ipInfo = { ip }
    try {
      ipInfo = await network.ip.getInfo(ip)
      ipInfo = JSON.parse(ipInfo)
      Object.assign({}, ipInfo, { ip })
      logger.info(`[IP:${ip}] ${JSON.stringify(ipInfo)}`)
    } catch (e) {
      logger.error(e)
    }
    await network.stat.putLogs(Object.assign({}, others, { login, ipInfo }))
  } catch (e) {
    logger.error(e)
  }
}

const collectResumeIpRecord = (key = 'params.hash') => async (ctx, next) => {
  const { ip } = ctx.request
  const { platform, browser, device } = ctx.state

  await next()

  dataRecord(ctx, key, updateLogData({
    ip,
    device,
    browser,
    platform,
    type: 'resume',
    action: 'pageview',
    datetime: new Date(),
  }))
}

const collectGitHubIpRecord = (key = 'params.login') => async (ctx, next) => {
  await next()
  const login = getValue(ctx, key)
  const { githubLogin } = ctx.session
  const { ip } = ctx.request
  const { platform, browser, device } = ctx.state

  if (githubLogin !== login) {
    updateLogData({
      ip,
      device,
      browser,
      platform,
      type: 'github',
      action: 'pageview',
      datetime: new Date(),
    })(ctx, login)
  }
}

export default {
  github: collectGithubRecord,
  resume: collectResumeRecordByHash,
  ipResume: collectResumeIpRecord,
  ipGitHub: collectGitHubIpRecord,
}
