/* eslint eqeqeq: "off", guard-for-in: "off" */

import config from 'config'
import getCacheKey from './helper/cacheKey'
import * as download from '../services/downloads'
import dateHelper from '../utils/date'
import logger from '../utils/logger'
import NewError from '../utils/error'
import notify from '../services/notify'
import network from '../services/network'
import Home from './home'
import { SCHOOLS } from '../utils/constant/school'
import { getUploadUrl, getOssObjectUrl, isLocalStorage } from '../utils/uploader'
import { getRecords, getLogs } from './helper/stat'
import { isGitHubSession } from '../utils/helper'

const ossConfig = config.get('services.oss')

/* ===================== private ===================== */

const resolveOrigin = (ctx, origin) => {
  if (typeof origin === 'string' && origin) return origin
  if (ctx && ctx.headers && typeof ctx.headers.origin === 'string' && ctx.headers.origin) {
    return ctx.headers.origin
  }
  if (ctx && ctx.protocol && ctx.host) {
    return `${ctx.protocol}://${ctx.host}`
  }
  if (config.has('url') && config.get('url')) {
    return config.get('url')
  }
  return 'https://hacknical.com'
}

const getResumeShareStatus = (resumeInfo, locale, origin) => {
  const originStr = (typeof origin === 'string' && origin) || (config.has('url') && config.get('url')) || 'https://hacknical.com'
  const baseUrl = originStr.replace(/\/$/, '')
  return {
    ...resumeInfo,
    githubUrl: `${baseUrl}/${resumeInfo.login}/github?locale=${locale}`,
    url: resumeInfo.simplifyUrl && resumeInfo.login && resumeInfo.isDefault
      ? `${resumeInfo.login}/resume?locale=${locale}`
      : `resume/${resumeInfo.resumeHash}?locale=${locale}`
  }
}

/* ===================== router handler ===================== */

const getResume = async (ctx) => {
  const {
    userId,
    githubToken,
    githubLogin
  } = ctx.session
  const { locale, resumeId } = ctx.query
  const data = await network.user.getResume({ userId, locale, resumeId })

  const { resume = null } = (data || {})
  if (
    resume && resume.info
  ) {
    if (!resume.info.languages || !resume.info.languages.length) {
      if (isGitHubSession(ctx.session)) {
        const languages = await network.github.getUserLanguages(githubLogin, githubToken)
        resume.info.languages = Object.keys(languages)
          .slice(0, 5)
          .sort((k1, k2) => languages[k2] - languages[k1])
      }
    }
  }

  ctx.body = {
    success: true,
    result: resume ? {
      ...resume,
      resumeId: data.resumeId,
      title: data.title,
      isDefault: data.isDefault
    } : null
  }
}

const setResume = async (ctx, next) => {
  const { resume, locale, resumeId: bodyResumeId } = ctx.request.body
  const { message, resumeId: queryResumeId } = ctx.query
  const resumeId = bodyResumeId || queryResumeId
  const { userId, githubLogin } = ctx.session

  const result = await network.user.updateResume({
    userId,
    resume,
    locale,
    resumeId,
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
    cacheKey(`resume.${result.hash}.${locale}`),
    cacheKey(`resume.${result.hash}.zh`),
    cacheKey(`resume.${result.hash}.en`),
    cacheKey(`resume.${result.hash}.`)
  ]
  logger.info(`[RESUME:UPDATE][${githubLogin}] - [cache:remove] ${ctx.query.deleteKeys}`)

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
  const { userId, githubLogin } = ctx.session
  const locale = ctx.query.locale || ctx.session.locale
  const { resumeId } = ctx.query

  const [
    resumeInfo,
    findResult
  ] = await Promise.all([
    network.user.getResumeInfo({ userId, resumeId }),
    network.user.getResume({ userId, locale, resumeId })
  ])
  const { template, resumeHash } = resumeInfo

  if (!findResult) {
    throw new NewError.NotfoundError(ctx.__('messages.error.emptyResume'))
  }

  const updateTime = findResult.update_at || findResult.updated_at
  const seconds = dateHelper.getSeconds(updateTime)

  const origin = resolveOrigin(ctx, ctx.request.origin)
  const resumeUrl =
    `${origin.replace(/\/$/, '')}/${getResumeShareStatus(resumeInfo, locale, origin).url}&userId=${userId}&notrace=true&fromDownload=true`

  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'download',
      data: `【${githubLogin}:${resumeHash}】`
    }
  })

  logger.info(`[RESUME:DOWNLOAD] - ${resumeUrl}`)

  network.stat.putStat({
    type: 'resume',
    action: 'download'
  })

  let resultUrl = ''
  let pageStyle = ''
  switch (ctx.query.pageStyle) {
    case 'onePage':
      pageStyle = 'onePage'
      break
    default:
      pageStyle = 'clippedPages'
  }

  try {
    resultUrl = await download.downloadResume(resumeUrl, {
      pageStyle,
      folderName: `${userId}/${githubLogin}`,
      title: `${template}-${locale}-${seconds}-resume-${pageStyle}.pdf`
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

const getSchoolInfo = async (ctx, next) => {
  const { school } = ctx.query

  ctx.body = {
    success: true,
    result: {
      name: school,
      types: SCHOOLS.get(school) || []
    }
  }

  await next()
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
  const uploadUrl = getUploadUrl({
    filePath,
    mimeType
  })
  const result = {
    uploadUrl: isLocalStorage
      ? uploadUrl
      : uploadUrl.replace(ossConfig.raw, ossConfig.url),
    previewUrl: getOssObjectUrl({ filePath, baseUrl: ossConfig.url })
  }
  logger.info(`upload: ${JSON.stringify(result)}`)

  ctx.body = {
    result,
    success: true
  }
}

const getResumeByHash = async (ctx, next) => {
  const { hash, locale } = ctx.query
  const findResult = await network.user.getResume({ hash, locale })

  logger.debug(`[getResumeByHash] ${JSON.stringify(findResult)}`)

  let result = null
  if (findResult) {
    const { languages, updated_at } = findResult
    result = Object.assign({}, findResult.resume, {
      languages
    })
    result.updateAt = updated_at

    if (result.info) {
      if (result.info.privacyProtect && result.info.phone) {
        result.info.phone = `${result.info.phone.slice(0, 3)}****${result.info.phone.slice(7)}`
      }
    }
  }

  ctx.body = {
    result,
    success: true,
  }

  await next()
}

const getResumeInfo = async (ctx) => {
  const { hash, userId, resumeId } = ctx.query
  const { locale = 'zh' } = ctx.session || {}
  const qs = {}
  if (hash) {
    qs.hash = hash
  } else if (resumeId) {
    qs.resumeId = resumeId
    if (userId) qs.userId = userId
    else if (ctx.session && ctx.session.userId) qs.userId = ctx.session.userId
  } else if (userId) {
    qs.userId = userId
  } else if (ctx.session && ctx.session.userId) {
    qs.userId = ctx.session.userId
  } else {
    ctx.body = {
      result: null,
      success: true,
    }
    return
  }
  const resumeInfo = await network.user.getResumeInfo(qs)

  let result = null
  if (resumeInfo) {
    const origin = resolveOrigin(ctx, ctx.request.origin)
    result = getResumeShareStatus(resumeInfo, locale, origin)
  }
  ctx.body = {
    result,
    success: true,
  }
}

const getShareLogs = async (ctx) => {
  const { limit } = ctx.query
  const { githubLogin } = ctx.session

  const logs = await getLogs(limit, {
    login: githubLogin,
    type: 'resume'
  })

  ctx.body = {
    success: true,
    result: logs
  }
}

const getShareRecords = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const { locale } = ctx.session
  const { resumeId } = ctx.query

  const resumeInfo = await network.user.getResumeInfo({ userId, resumeId })

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

  const record = await getRecords(100, {
    login: githubLogin,
    type: 'resume'
  })
  ctx.body = {
    success: true,
    result: {
      ...record,
      openShare: resumeInfo.openShare,
      url: getResumeShareStatus(resumeInfo, locale).url
    }
  }
}

const setResumeInfo = async (ctx) => {
  const { info, resumeId: bodyResumeId } = ctx.request.body
  const { resumeId: queryResumeId } = ctx.query
  const resumeId = bodyResumeId || queryResumeId || (info && info.resumeId)
  const { userId, githubLogin } = ctx.session

  const result = await network.user.setResumeInfo({
    info,
    resumeId,
    userId,
    login: githubLogin
  })

  ctx.body = {
    result,
    success: true
  }
}

const getResumeList = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const list = await network.user.getResumeList(userId)
  const origin = resolveOrigin(ctx, ctx.request.origin)
  const baseUrl = origin.replace(/\/$/, '')
  const result = (list || []).map((item) => {
    const isDefault = Boolean(item.isDefault)
    const simplifyUrl = Boolean(item.simplifyUrl)
    const sharePath = isDefault && simplifyUrl && githubLogin
      ? `${githubLogin}/resume`
      : `resume/${item.resumeHash}`
    return {
      ...item,
      isDefault,
      simplifyUrl,
      sharePath,
      shareUrl: `${baseUrl}/${sharePath}`
    }
  })
  ctx.body = {
    success: true,
    result
  }
}

const createNewResume = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const { title, copyFromResumeId } = ctx.request.body || {}
  const result = await network.user.createNewResume(userId, githubLogin, {
    title,
    copyFromResumeId
  })
  ctx.body = {
    success: true,
    result
  }
}

const setDefaultResume = async (ctx) => {
  const { userId } = ctx.session
  const { resumeId } = ctx.request.body || {}
  if (!resumeId) {
    ctx.status = 400
    ctx.body = { success: false, message: '缺少简历ID' }
    return
  }
  try {
    const list = await network.user.setDefaultResume(userId, resumeId)
    ctx.body = {
      success: true,
      result: list
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: err.message || '设置默认失败'
    }
  }
}

const deleteResume = async (ctx) => {
  const { userId } = ctx.session
  const resumeId = ctx.params.resumeId || (ctx.request.body && ctx.request.body.resumeId) || ctx.query.resumeId
  if (!resumeId) {
    ctx.status = 400
    ctx.body = { success: false, message: '缺少简历ID' }
    return
  }
  try {
    const list = await network.user.deleteResume(userId, resumeId)
    ctx.body = {
      success: true,
      result: list
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: err.message || '删除失败'
    }
  }
}

const renameResume = async (ctx) => {
  const { userId } = ctx.session
  const { resumeId, title } = ctx.request.body || {}
  if (!resumeId || !title) {
    ctx.status = 400
    ctx.body = { success: false, message: '缺少简历ID或名称' }
    return
  }
  try {
    const result = await network.user.renameResume(userId, resumeId, title)
    ctx.body = {
      success: true,
      result
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: err.message || '重命名失败'
    }
  }
}

const copyResume = async (ctx) => {
  const { userId, githubLogin } = ctx.session
  const { resumeId, title } = ctx.request.body || {}
  if (!resumeId) {
    ctx.status = 400
    ctx.body = { success: false, message: '缺少简历ID' }
    return
  }
  try {
    const result = await network.user.copyResume(userId, githubLogin, resumeId, title)
    ctx.body = {
      success: true,
      result
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      message: err.message || '复制失败'
    }
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
  getShareLogs,
  getImageUploadUrl,
  // ============
  getResumeInfo,
  setResumeInfo,
  getSchoolInfo,
  // ============ 多简历
  getResumeList,
  createNewResume,
  setDefaultResume,
  deleteResume,
  renameResume,
  copyResume
}
