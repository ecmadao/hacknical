/* eslint eqeqeq: "off", guard-for-in: "off" */

import getCacheKey from './helper/cacheKey'
import * as download from '../services/downloads'
import dateHelper from '../utils/date'
import logger from '../utils/logger'
import NewError from '../utils/error'
import notify from '../services/notify'
import network from '../services/network'
import Home from './home'

/* ===================== private ===================== */

const getResumeShareStatus = (resumeInfo, locale) => {
  const {
    login,
    github,
    reminder,
    template,
    useGithub,
    resumeHash,
    openShare,
    simplifyUrl
  } = resumeInfo

  return {
    login,
    github,
    locale,
    template,
    reminder,
    openShare,
    useGithub,
    resumeHash,
    simplifyUrl,
    githubUrl: `hacknical.com/${login}/github?locale=${locale}`,
    url: simplifyUrl && login
      ? `${login}/resume?locale=${locale}`
      : `resume/${resumeHash}?locale=${locale}`
  }
}

/* ===================== router handler ===================== */

const getResume = async (ctx) => {
  const { userId } = ctx.session
  const data = await network.user.getResume({ userId })

  ctx.body = {
    success: true,
    result: data ? data.resume : null
  }
}

const setResume = async (ctx, next) => {
  const { resume } = ctx.request.body
  const { message } = ctx.query
  const { userId, githubLogin } = ctx.session

  const result = await network.user.updateResume({
    userId,
    resume,
    login: githubLogin
  })

  if (result.newResume) {
    network.stat.putStat({
      type: 'resume',
      action: 'count'
    })
  }

  const cacheKey = getCacheKey(ctx);
  ctx.query.deleteKeys = [
    cacheKey(`resume.${result.hash}`)
  ]
  logger.info(`[RESUME:UPDATE][${githubLogin}]`)

  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'resume',
      data: `Resume create or update by <https://github.com/${githubLogin}|${githubLogin}>`
    }
  })

  ctx.body = {
    result,
    success: true,
    message: message ? ctx.__('messages.success.save') : null,
  }

  await next()
}

const downloadResume = async (ctx) => {
  const { userId, githubLogin, locale } = ctx.session

  const [
    result,
    findResult
  ] = await Promise.all([
    network.user.getResumeInfo({ userId }),
    network.user.getResume({ userId })
  ])
  const { template, resumeHash } = result

  if (!findResult) {
    throw new NewError.NotfoundError(ctx.__('messages.error.emptyResume'))
  }

  const updateTime = findResult.update_at || findResult.updated_at
  const seconds = dateHelper.getSeconds(updateTime)

  const resumeUrl =
    `${ctx.request.origin}/resume/${resumeHash}?locale=${locale}&userId=${userId}&notrace=true&fromDownload=true`

  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'download',
      data: `【${githubLogin}:${resumeHash}】`
    }
  })

  logger.info(`[RESUME:DOWNLOAD][${resumeUrl}]`)

  network.stat.putStat({
    type: 'resume',
    action: 'download'
  })

  let resultUrl = ''
  try {
    resultUrl = await download.downloadResume(resumeUrl, {
      folder: githubLogin,
      title: `${template}-${locale}-${seconds}-resume.pdf`
    })
    logger.info(`[RESUME:RENDERED][${resultUrl}]`)
  } catch (e) {
    logger.error(`[RESUME:DOWNLOAD:ERROR]${e}`)
  }

  ctx.body = {
    result: resultUrl,
    success: true
  }
}

const renderResumePage = async (ctx) => {
  const { resumeInfo } = ctx
  const { login } = resumeInfo
  const { fromDownload } = ctx.query
  const user = await network.user.getUser({ login })

  const { device } = ctx.state
  const { githubLogin } = ctx.session
  const isAdmin = login === githubLogin
  const { userName, userId } = user

  Home.cacheControl(ctx)
  await ctx.render(`resume/${device}`, {
    login,
    userId,
    fromDownload,
    user: {
      login,
      isAdmin,
    },
    hideFooter: true,
    title: ctx.__('resumePage.title', userName),
  })
}

const getResumeByHash = async (ctx, next) => {
  const { hash } = ctx.query
  const findResult = await network.user.getResume({ hash })

  let result = null
  if (findResult) {
    result = findResult.resume
    result.updateAt = findResult.updated_at
  }

  ctx.body = {
    result,
    success: true,
  }

  await next()
}

const getResumeInfo = async (ctx) => {
  const { hash, userId } = ctx.query
  const { locale } = ctx.session
  const qs = {}
  if (hash) {
    qs.hash = hash
  } else if (userId) {
    qs.userId = userId
  } else {
    qs.userId = ctx.session.userId
  }
  const resumeInfo = await network.user.getResumeInfo(qs)

  let result = null
  if (resumeInfo) {
    result = getResumeShareStatus(resumeInfo, locale)
  }
  ctx.body = {
    result,
    success: true,
  }
}

const getShareRecords = async (ctx) => {
  const { userId, githubLogin } = ctx.session

  const resumeInfo = await network.user.getResumeInfo({ userId })
  if (!resumeInfo) {
    return ctx.body = {
      success: true,
      result: {
        url: '',
        viewDevices: [],
        viewSources: [],
        pageViews: [],
        openShare: false
      }
    }
  }

  const records = await network.stat.getRecords({
    login: githubLogin,
    type: 'resume'
  })

  const viewDevices = []
  const viewSources = []
  const pageViews = []

  for (const record of records) {
    viewDevices.push(...record.viewDevices)
    viewSources.push(...record.viewSources)
    pageViews.push(...record.pageViews)
  }
  ctx.body = {
    success: true,
    result: {
      pageViews,
      viewDevices,
      viewSources,
      openShare: resumeInfo.openShare,
      url: `${githubLogin}/resume?locale=${ctx.session.locale}`,
    }
  }
}

const setResumeInfo = async (ctx) => {
  const { info } = ctx.request.body
  const { userId, githubLogin } = ctx.session

  const result = await network.user.setResumeInfo({
    info,
    userId,
    login: githubLogin
  })

  ctx.body = {
    result,
    success: true,
  }
}

export default {
  // ============
  getResume,
  setResume,
  // ============
  renderResumePage,
  getResumeByHash,
  // ============
  downloadResume,
  getShareRecords,
  // ============
  getResumeInfo,
  setResumeInfo
}
