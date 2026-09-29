import { randomUUID } from 'node:crypto'
import db, { now, parseJson, stringifyJson } from '../../utils/sqlite'

const DEFAULT_RESUME_SECTIONS = [
  {
    id: 'info', enabled: true, canbeDisabled: false, canbeReorder: false
  },
  {
    id: 'workExperiences', enabled: true, canbeDisabled: true, canbeReorder: true
  },
  {
    id: 'personalProjects', enabled: true, canbeDisabled: true, canbeReorder: true
  },
  {
    id: 'educations', enabled: true, canbeDisabled: true, canbeReorder: true
  },
  {
    id: 'others', enabled: true, canbeDisabled: true, canbeReorder: true
  }
]

const DEFAULT_GITHUB_SECTIONS = [
  'hotmap', 'info', 'repos', 'course', 'languages', 'orgs', 'contributed', 'commits'
].map(id => ({ id, enabled: true }))

const defaultResume = () => ({
  info: {},
  others: { socialLinks: [] },
  educations: [],
  workExperiences: [],
  personalProjects: [],
  customModules: []
})

const flagValue = (value, fallback) => {
  if (value === undefined) return fallback
  return value ? 1 : 0
}

const createResume = (userId, login) => {
  const timestamp = now()
  const hash = randomUUID().replace(/-/g, '').slice(0, 16)
  db.prepare(`
    INSERT OR IGNORE INTO resumes
      (user_id, resume_hash, data, template, simplify_url, open_share,
       use_github, autosave, resume_sections, github_sections, created_at, updated_at)
    VALUES (?, ?, ?, 'v1', 1, 0, 0, 0, ?, ?, ?, ?)
  `).run(
    userId,
    hash,
    stringifyJson(defaultResume()),
    stringifyJson(DEFAULT_RESUME_SECTIONS),
    stringifyJson(DEFAULT_GITHUB_SECTIONS),
    timestamp,
    timestamp
  )
  return getResumeInfo({ userId, login })
}

const rowToUser = (row) => {
  if (!row) return null
  const data = parseJson(row.data, {})
  return {
    ...data,
    userId: row.user_id,
    githubLogin: row.github_login,
    initialed: Boolean(row.initialed),
    githubShare: Boolean(row.github_share),
    openShare: Boolean(row.github_share)
  }
}

const findUserRow = (qs = {}) => {
  if (qs.userId) {
    return db.prepare('SELECT * FROM users WHERE user_id = ?').get(String(qs.userId))
  }
  const login = qs.login || qs.githubLogin
  if (login) {
    return db.prepare('SELECT * FROM users WHERE github_login = ?').get(String(login))
  }
  return null
}

const getUser = async (qs = {}) => rowToUser(findUserRow(qs))

const createUser = async (input = {}) => {
  const login = input.login || input.githubLogin
  if (!login) throw new Error('GitHub login is required')

  const existing = findUserRow({ login })
  const timestamp = now()
  if (existing) {
    const data = {
      ...parseJson(existing.data, {}),
      ...input,
      userName: input.name || input.userName || parseJson(existing.data, {}).userName || login
    }
    db.prepare(`
      UPDATE users SET data = ?, updated_at = ? WHERE user_id = ?
    `).run(stringifyJson(data), timestamp, existing.user_id)
    return rowToUser(db.prepare('SELECT * FROM users WHERE user_id = ?').get(existing.user_id))
  }

  const userId = randomUUID()
  const data = {
    ...input,
    userName: input.name || input.userName || login,
    githubShare: true,
    openShare: true,
    initialed: false
  }
  db.prepare(`
    INSERT INTO users (user_id, github_login, data, initialed, github_share, created_at, updated_at)
    VALUES (?, ?, ?, 0, 1, ?, ?)
  `).run(userId, login, stringifyJson(data), timestamp, timestamp)
  createResume(userId, login)
  return rowToUser(db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId))
}

const updateUser = async (userId, changes = {}) => {
  const row = findUserRow({ userId })
  if (!row) return null
  const data = { ...parseJson(row.data, {}), ...changes }
  const initialed = flagValue(changes.initialed, row.initialed)
  const githubShare = flagValue(changes.githubShare, row.github_share)
  db.prepare(`
    UPDATE users
    SET data = ?, initialed = ?, github_share = ?, updated_at = ?
    WHERE user_id = ?
  `).run(stringifyJson(data), initialed, githubShare, now(), userId)
  return getUser({ userId })
}

const getUserCount = async () => {
  const row = db.prepare('SELECT COUNT(*) AS count FROM users').get()
  return row.count
}

const findResumeRow = (qs = {}) => {
  if (qs.hash) {
    return db.prepare(`
      SELECT r.*, u.github_login FROM resumes r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.resume_hash = ?
    `).get(String(qs.hash))
  }
  if (qs.userId) {
    return db.prepare(`
      SELECT r.*, u.github_login FROM resumes r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.user_id = ?
    `).get(String(qs.userId))
  }
  return null
}

const rowToResumeInfo = row => row && ({
  userId: row.user_id,
  login: row.github_login,
  resumeHash: row.resume_hash,
  template: row.template,
  simplifyUrl: Boolean(row.simplify_url),
  openShare: Boolean(row.open_share),
  useGithub: Boolean(row.use_github),
  autosave: Boolean(row.autosave),
  resumeSections: parseJson(row.resume_sections, DEFAULT_RESUME_SECTIONS),
  githubSections: parseJson(row.github_sections, DEFAULT_GITHUB_SECTIONS),
  updated_at: row.updated_at,
  created_at: row.created_at
})

const getResumeInfo = async (qs = {}) => rowToResumeInfo(findResumeRow(qs))

const getResume = async (qs = {}) => {
  const row = findResumeRow(qs)
  if (!row) return null
  const resume = parseJson(row.data, defaultResume())
  return {
    resume,
    languages: resume.info && resume.info.languages ? resume.info.languages : [],
    updated_at: row.updated_at,
    created_at: row.created_at
  }
}

const updateResume = async ({
  userId, login, resume, locale
}) => {
  let targetUserId = userId
  let row = findResumeRow({ userId: targetUserId })
  if (!row && login) {
    const user = await getUser({ login })
    if (user) {
      createResume(user.userId, login)
      row = findResumeRow({ userId: user.userId })
      targetUserId = user.userId
    }
  }
  if (!row) throw new Error('User resume does not exist')

  const timestamp = now()
  db.prepare('UPDATE resumes SET data = ?, updated_at = ? WHERE user_id = ?')
    .run(stringifyJson(resume || defaultResume()), timestamp, targetUserId)
  return {
    ...(await getResumeInfo({ userId: targetUserId })),
    hash: row.resume_hash,
    locale,
    newResume: false
  }
}

const setResumeInfo = async ({ userId, login, info = {} }) => {
  let targetUserId = userId
  let row = findResumeRow({ userId: targetUserId })
  if (!row && login) {
    const user = await getUser({ login })
    if (user) {
      createResume(user.userId, login)
      row = findResumeRow({ userId: user.userId })
      targetUserId = user.userId
    }
  }
  if (!row) return null

  const values = {
    template: info.template === undefined ? row.template : info.template,
    simplifyUrl: flagValue(info.simplifyUrl, row.simplify_url),
    openShare: flagValue(info.openShare, row.open_share),
    useGithub: flagValue(info.useGithub, row.use_github),
    autosave: flagValue(info.autosave, row.autosave),
    resumeSections: info.resumeSections || parseJson(row.resume_sections, DEFAULT_RESUME_SECTIONS),
    githubSections: info.githubSections || parseJson(row.github_sections, DEFAULT_GITHUB_SECTIONS)
  }
  db.prepare(`
    UPDATE resumes
    SET template = ?, simplify_url = ?, open_share = ?, use_github = ?, autosave = ?,
        resume_sections = ?, github_sections = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    values.template,
    values.simplifyUrl,
    values.openShare,
    values.useGithub,
    values.autosave,
    stringifyJson(values.resumeSections),
    stringifyJson(values.githubSections),
    now(),
    targetUserId
  )
  return getResumeInfo({ userId: targetUserId })
}

export default {
  getUser,
  createUser,
  updateUser,
  getUserCount,
  getResume,
  updateResume,
  getResumeInfo,
  setResumeInfo,
  getResumeCount: async () => db.prepare('SELECT COUNT(*) AS count FROM resumes').get().count
}
