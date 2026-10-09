
import network from '../services/network'
import notify from '../services/notify'
import getCacheKey from './helper/cacheKey'
import { isGitHubSession } from '../utils/helper'

const getUserStatistic = async (ctx) => {
  if (!isGitHubSession(ctx.session)) {
    ctx.body = {
      result: null,
      success: true
    }
    return
  }
  const { login } = ctx.params
  const { githubToken } = ctx.session
  try {
    const result = await network.github.getUserStatistic(login, githubToken)
    ctx.body = {
      result,
      success: true
    }
  } catch (err) {
    if (err && err.message && err.message.includes('GitHub API 401')) {
      ctx.body = {
        result: null,
        success: true
      }
      return
    }
    throw err
  }
}

const getUserPredictions = async (ctx) => {
  if (!isGitHubSession(ctx.session)) {
    ctx.body = {
      result: [],
      success: true
    }
    return
  }
  const { login } = ctx.params
  const { githubToken, githubLogin } = ctx.session
  let result = []
  try {
    result = login === githubLogin
      ? (await network.github.getUserPredictions(githubLogin, githubToken) || [])
      : []
  } catch (err) {
    if (err && err.message && err.message.includes('GitHub API 401')) {
      result = []
    } else {
      throw err
    }
  }

  const results = await Promise.all(result.map(async (repository) => {
    const { full_name } = repository

    const stats = await network.stat.getStat({
      type: 'scientific-feedback',
      action: `${full_name}.liked`
    })
    const stat = stats[0] || { count: 0 }

    const likedCount = stat.count
    repository.likedCount = likedCount || 0
    return repository
  }))
  ctx.body = {
    success: true,
    result: results
  }
}

const removePrediction = async (ctx, next) => {
  const { login } = ctx.params
  const { githubLogin } = ctx.session
  const { fullName } = ctx.request.body
  if (login === githubLogin) {
    await network.github.removePrediction(login, fullName)
  }

  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'scientific',
      data: `Prediction removed by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
    }
  })

  const cacheKey = getCacheKey(ctx)
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ]

  await network.stat.putStat({
    type: 'scientific-prediction',
    action: `${login}.remove`
  })
  ctx.body = {
    success: true
  }
  await next()
}

const putPredictionFeedback = async (ctx, next) => {
  const { login } = ctx.params
  const { githubLogin } = ctx.session
  const { fullName, liked } = ctx.request.body
  if (login === githubLogin) {
    await network.github.putPredictionsFeedback(login, fullName, liked)
  }

  const likeText = Number(liked) > 0 ? 'liked' : 'disliked'
  notify.slack({
    mq: ctx.mq,
    data: {
      type: 'scientific',
      data: `Prediction ${likeText} by <https://github.com/${githubLogin}|${githubLogin}>: <https://github.com/${fullName}|${fullName}>`
    }
  })

  const cacheKey = getCacheKey(ctx)
  ctx.query.deleteKeys = [
    cacheKey('user-predictions', {
      params: ['login']
    })
  ]

  await Promise.all([
    network.stat.putStat({
      type: 'scientific-prediction',
      action: `${login}.${likeText}`
    }),
    network.stat.putStat({
      type: 'scientific-feedback',
      action: `${fullName}.${likeText}`
    })
  ])

  ctx.body = {
    success: true
  }
  await next()
}

export default {
  removePrediction,
  getUserStatistic,
  getUserPredictions,
  putPredictionFeedback
}
