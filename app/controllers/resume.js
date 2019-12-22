/* eslint eqeqeq: "off", guard-for-in: "off" */

import getCacheKey from './helper/cacheKey'
import * as download from '../services/downloads'
import dateHelper from '../utils/date'
import logger from '../utils/logger'
import NewError from '../utils/error'
import notify from '../services/notify'
import network from '../services/network'
import Home from './home'
import { getUploadUrl, getOssObjectUrl } from '../utils/uploader'

/* ===================== private ===================== */

const updateResumeAvator = async (resume, ctx) => {
  if (!resume.info || resume.info.avator) return resume
  let avator = ctx.session.githubAvator
  if (!avator) {
    const user = await network.github.getUser(ctx.session.githubLogin)
    avator = user.avatar_url
  }
  resume.info.avator = avator
  return resume
}

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
    githubUrl: `https://hacknical.com/${login}/github?locale=${locale}`,
    url: simplifyUrl && login
      ? `${login}/resume?locale=${locale}`
      : `resume/${resumeHash}?locale=${locale}`
  }
}

/* ===================== router handler ===================== */

const getResume = async (ctx) => {
  const { userId, githubToken, githubLogin } = ctx.session
  const data = await network.user.getResume({ userId })

  let resume = null
  if (
    data
    && data.resume
    && data.resume.info
  ) {
    resume = await updateResumeAvator(data.resume, ctx)
    if (!resume.info.languages || !resume.info.languages.length) {
      const languages = await network.github.getUserLanguages(githubLogin, githubToken)
      resume.info.languages = Object.keys(languages)
        .slice(0, 5)
        .sort((k1, k2) => languages[k2] - languages[k1])
    }
  }

  ctx.body = {
    success: true,
    result: resume
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

  const cacheKey = getCacheKey(ctx)
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
    resumeInfo,
    findResult
  ] = await Promise.all([
    network.user.getResumeInfo({ userId }),
    network.user.getResume({ userId })
  ])
  const { template, resumeHash } = resumeInfo

  if (!findResult) {
    throw new NewError.NotfoundError(ctx.__('messages.error.emptyResume'))
  }

  const updateTime = findResult.update_at || findResult.updated_at
  const seconds = dateHelper.getSeconds(updateTime)

  const resumeUrl =
    `${ctx.request.origin}/${getResumeShareStatus(resumeInfo, locale).url}&userId=${userId}&notrace=true&fromDownload=true`

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
      folderName: `${userId}/${githubLogin}`,
      title: `${template}-${locale}-${seconds}-resume.pdf`
    })
    logger.info(`[RESUME:RENDERED][${resultUrl}]`)
  } catch (e) {
    logger.error(`[RESUME:DOWNLOAD:ERROR]${e}`)
  }

  ctx.body = {
    success: true,
    result: resultUrl,
    message: resultUrl ? '' : ctx.__('messages.error.download')
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

const getImageUploadUrl = async (ctx) => {
  const { githubLogin } = ctx.session
  const { filename } = ctx.query

  const fileExt = filename.split('.').slice(-1)[0].toLowerCase()

  let mimeType = null
  switch (fileExt) {
    case 'jpg':
      mimeType = 'image/jpeg'
      break;
    case 'jpeg':
      mimeType = 'image/jpeg'
      break;
    case 'png':
      mimeType = 'image/png'
      break;
    default:
      throw new Error(`unsupport filetype ${fileExt}`)
  }

  const filePath = `/uploads/${githubLogin}/avator/${new Date().getTime()}.${filename}`

  ctx.body = {
    result: {
      uploadUrl: getUploadUrl({
        filePath,
        mimeType
      }),
      previewUrl: getOssObjectUrl({ filePath })
    },
    success: true
  }
}

const getResumeByHash = async (ctx, next) => {
  const { hash } = ctx.query
  const findResult = await network.user.getResume({ hash })

  let result = null
  if (findResult) {
    result = findResult.resume
    result.updateAt = findResult.updated_at

    if (result.info) {
      if (result.info.privacyProtect && result.info.phone) {
        result.info.phone = `${result.info.phone.slice(0, 3)}****${result.info.phone.slice(7)}`
      }

      result = await updateResumeAvator(result, ctx)
    }
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
  const { locale } = ctx.session

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

  let records = []
  try {
    records = await network.stat.getRecords({
      login: githubLogin,
      type: 'resume'
    })
  } catch (e) {
    logger.error(e)
  }

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
      url: getResumeShareStatus(resumeInfo, locale).url
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
    success: true
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
  getImageUploadUrl,
  // ============
  getResumeInfo,
  setResumeInfo
}
