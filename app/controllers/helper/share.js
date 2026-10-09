
import { getValue } from '../../utils/helper'
import network from '../../services/network'

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

  if (!resumeInfo.openShare) return false
  if (options.login && !options.pinyin && !resumeInfo.simplifyUrl) return false

  return true
}

const isResumeDownload = (resumeInfo, query) => {
  const {
    userId,
    notrace,
  } = query

  if (resumeInfo.userId === userId && notrace === 'true') return true
  return false
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
    || (
      !isResumeOpenShare(resumeInfo, { userId, [key]: value, pinyin })
      && !isResumeDownload(resumeInfo, ctx.query || {})
    )
  ) {
    return ctx.redirect('/404')
  }

  ctx.resumeInfo = resumeInfo
  await next()
}

export default {
  githubEnable,
  resumeEnable
}
