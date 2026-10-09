
import { getValue } from '../../utils/helper'
import network from '../../services/network'
import { canReadResume, verifyDownloadToken } from '../../utils/resume-access'

const githubEnable = (key = 'params.login') => async (ctx, next) => {
  const login = getValue(ctx, key)
  const { githubLogin } = ctx.session
  const user = await network.user.getUser({ login })

  const userLogin = user.githubLogin
  if (userLogin !== login || (!user.githubShare && userLogin !== githubLogin)) {
    return ctx.redirect('/404')
  }
  await next()
}

const isResumeOpenShare = (resumeInfo, options) => {
  if (resumeInfo.userId === options.userId) return true
  if (verifyDownloadToken(resumeInfo.resumeHash, options.downloadToken)) return true

  if (!resumeInfo.openShare) return false
  if (options.login && !options.pinyin && !resumeInfo.simplifyUrl) return false

  return true
}

const resumeParamsFormatter = async (ctx, source, pinyinSource = null) => {
  const key = source.split('.').slice(-1)[0]
  const value = getValue(ctx, source)
  const pinyin = pinyinSource ? getValue(ctx, pinyinSource) : (ctx.params && ctx.params.pinyin)

  if (key === 'login') {
    const user = await network.user.getUser({ login: value })
    const qs = {
      userId: user.userId
    }
    if (pinyin) {
      qs.pinyin = pinyin
    }
    return qs
  }
  return {
    [key]: value
  }
}

const resumeEnable = (source = 'params.login', pinyinSource = null) => async (ctx, next) => {
  const key = source.split('.').slice(-1)[0]
  const value = getValue(ctx, source)
  const pinyin = pinyinSource ? getValue(ctx, pinyinSource) : (ctx.params && ctx.params.pinyin)
  const { userId } = ctx.session

  const qs = await resumeParamsFormatter(ctx, source, pinyinSource)
  const resumeInfo = await network.user.getResumeInfo(qs)

  if (
    !resumeInfo
    || !isResumeOpenShare(resumeInfo, {
      userId,
      [key]: value,
      pinyin,
      downloadToken: ctx.query.downloadToken
    })
  ) {
    return ctx.redirect('/404')
  }

  ctx.resumeInfo = resumeInfo
  await next()
}

const resumeApiEnable = () => async (ctx, next) => {
  const resumeInfo = await network.user.getResumeInfo({ hash: ctx.query.hash })
  if (!canReadResume(resumeInfo, ctx.session, ctx.query.downloadToken)) {
    ctx.status = 404
    ctx.body = { success: false, message: 'Resume not found' }
    return
  }
  ctx.resumeInfo = resumeInfo
  await next()
}

export default {
  githubEnable,
  resumeEnable,
  resumeApiEnable
}
