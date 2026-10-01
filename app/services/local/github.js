import request from 'request'
import config from 'config'
import { getToken, getLogin } from '../github-oauth'
import db, { now, parseJson, stringifyJson } from '../../utils/sqlite'

const githubConfig = config.get('github')
const API_URL = (process.env.GITHUB_API_URL || githubConfig.apiUrl || 'https://api.github.com').replace(/\/$/, '')

const apiRequest = (method, target, token, options = {}) => new Promise((resolve, reject) => {
  request({
    method,
    url: `${API_URL}${target}`,
    json: true,
    timeout: options.timeout || 10000,
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'hacknical',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    body: options.body
  }, (error, response, body) => {
    if (error) return reject(error)
    if (!response || response.statusCode < 200 || response.statusCode >= 300) {
      return reject(new Error(`GitHub API ${response && response.statusCode}: ${JSON.stringify(body)}`))
    }
    return resolve(body)
  })
})

const cacheGet = (login, kind) => {
  const row = db.prepare('SELECT data FROM github_cache WHERE login = ? AND kind = ?').get(login, kind)
  return row ? parseJson(row.data) : null
}

const cacheSet = (login, kind, value) => {
  db.prepare(`
    INSERT INTO github_cache (login, kind, data, updated_at) VALUES (?, ?, ?, ?)
    ON CONFLICT(login, kind) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run(login, kind, stringifyJson(value), now())
  return value
}

const cachedRequest = async (login, kind, path, token, fallback) => {
  // A local login is deliberately offline. Reuse seeded SQLite data when it
  // exists and otherwise return the local fallback without contacting GitHub.
  if (String(token).startsWith('local:')) {
    return cacheGet(login, kind) || fallback
  }
  try {
    const value = await apiRequest('GET', path, token)
    return cacheSet(login, kind, value)
  } catch (e) {
    if (e && e.message && e.message.includes('GitHub API 401')) {
      throw e
    }
    return cacheGet(login, kind) || fallback
  }
}

const getUser = async (login, token) => cachedRequest(login, 'user', `/users/${encodeURIComponent(login)}`, token, {
  login,
  name: login,
  avatar_url: '',
  html_url: `https://github.com/${login}`
})

const getUserRepositories = async (login, token) => cachedRequest(
  login,
  'repositories',
  `/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated`,
  token,
  []
)

const getUserOrganizations = async (login, token) => cachedRequest(
  login,
  'organizations',
  `/users/${encodeURIComponent(login)}/orgs?per_page=100`,
  token,
  []
)

const getUserLanguages = async (login, token) => {
  const repositories = await getUserRepositories(login, token)
  return repositories.reduce((languages, repository) => {
    if (repository.language) {
      languages[repository.language] = (languages[repository.language] || 0) + 1
    }
    return languages
  }, {})
}

const emptyHotmap = () => ({
  start: null, end: null, datas: [], total: 0, streak: null
})
const getUserCommits = async login => {
  const cached = cacheGet(login, 'commits')
  if (Array.isArray(cached)) return cached
  if (cached && Array.isArray(cached.commits)) return cached.commits
  return []
}
const getUserContributed = async login => cacheGet(login, 'contributed') || []
const getHotmap = async login => cacheGet(login, 'hotmap') || emptyHotmap()
const getUpdateStatus = async login => cacheGet(login, 'update-status') || {
  status: 0,
  startUpdateAt: null,
  lastUpdateTime: null
}

const updateUserData = async (login, token) => {
  try {
    await Promise.all([
      getUser(login, token),
      getUserRepositories(login, token),
      getUserOrganizations(login, token)
    ])
    cacheSet(login, 'update-status', { status: 1, startUpdateAt: null, lastUpdateTime: now() })
    return true
  } catch (e) {
    if (e && e.message && e.message.includes('GitHub API 401')) {
      cacheSet(login, 'update-status', { status: 4, startUpdateAt: null, lastUpdateTime: now() })
    } else {
      cacheSet(login, 'update-status', { status: 1, startUpdateAt: null, lastUpdateTime: now() })
    }
    return false
  }
}

const updateUser = async (login, data) => {
  if (data && data.status !== undefined) {
    const current = cacheGet(login, 'update-status') || {}
    cacheSet(login, 'update-status', {
      ...current,
      status: data.status,
      startUpdateAt: data.startUpdateAt !== undefined ? data.startUpdateAt : current.startUpdateAt,
      lastUpdateTime: data.lastUpdateTime !== undefined ? data.lastUpdateTime : current.lastUpdateTime
    })
  }
  return cacheSet(login, 'user', { ...(cacheGet(login, 'user') || {}), ...data })
}

const getZen = async (token) => {
  try { return await apiRequest('GET', '/zen', token) } catch (e) { return 'Keep it logically awesome.' }
}

const getOctocat = async (token) => {
  try { return await apiRequest('GET', '/octocat', token) } catch (e) { return '' }
}

const getUserStatistic = async login => cacheGet(login, 'scientific-statistic') || null
const getUserPredictions = async login => cacheGet(login, 'predictions') || []
const removePrediction = async (login, fullName) => {
  const predictions = (cacheGet(login, 'predictions') || []).filter(item => item.full_name !== fullName)
  cacheSet(login, 'predictions', predictions)
  return true
}
const putPredictionsFeedback = async () => true

export default {
  getToken,
  getLogin,
  getVerify: async () => true,
  getUser,
  getUserRepositories,
  getUserContributed,
  getUserCommits,
  getUserLanguages,
  getUserOrganizations,
  getUpdateStatus,
  updateUserData,
  updateUser,
  getHotmap,
  getZen,
  getOctocat,
  getUserStatistic,
  getUserPredictions,
  removePrediction,
  putPredictionsFeedback
}
