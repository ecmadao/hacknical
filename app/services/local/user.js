import { randomUUID } from 'node:crypto'
import db, { now, parseJson, stringifyJson } from '../../utils/sqlite'
import { hashPassword, verifyPassword } from '../../utils/password'

const RESERVED_USERNAMES = new Set([
  'api', 'login', 'logout', 'resume', 'github', 'initial',
  '404', '500', 'dashboard', 'user', 'settings', 'admin',
  'administrator', 'root', 'static', 'assets', 'public'
])

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

const SUPPORTED_GITHUB_SECTIONS = new Set(['info', 'repos', 'languages'])

const DEFAULT_GITHUB_SECTIONS = [
  'info', 'repos', 'languages'
].map(id => ({ id, enabled: true }))

const sanitizeGithubSections = (sections) => {
  const list = Array.isArray(sections) ? sections : DEFAULT_GITHUB_SECTIONS
  const filtered = list.filter(sec => SUPPORTED_GITHUB_SECTIONS.has(sec && sec.id))
  return filtered.length ? filtered : DEFAULT_GITHUB_SECTIONS
}

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

const normalizeLocale = (locale) => {
  if (!locale) return 'zh'
  if (/^en/i.test(locale)) return 'en'
  if (/^zh/i.test(locale)) return 'zh'
  return 'zh'
}

const RESUME_LANGUAGE_OPTIONS = {
  zh: { id: 'zh', text: '中文' },
  en: { id: 'en', text: 'English' }
}

const parseResumeLocales = (rawData) => {
  const parsed = parseJson(rawData, null)
  if (!parsed) return { zh: defaultResume() }
  if (parsed._locales && typeof parsed._locales === 'object') {
    return parsed._locales
  }
  return {
    zh: parsed
  }
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
    stringifyJson({ _locales: { zh: defaultResume() } }),
    stringifyJson(DEFAULT_RESUME_SECTIONS),
    stringifyJson(DEFAULT_GITHUB_SECTIONS),
    timestamp,
    timestamp
  )
  return getResumeInfo({ userId, login })
}

const runTransaction = (fn) => {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}

const rowToUser = (row) => {
  if (!row) return null
  const data = parseJson(row.data, {})
  return {
    ...data,
    userId: row.user_id,
    githubLogin: row.github_login,
    login: row.github_login,
    email: row.email || data.email || '',
    authProvider: row.auth_provider || 'github',
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
    return db.prepare('SELECT * FROM users WHERE lower(github_login) = lower(?)').get(String(login))
  }
  if (qs.email) {
    return db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(String(qs.email))
  }
  return null
}

const getUser = async (qs = {}) => rowToUser(findUserRow(qs))

const getInviteCode = (code) => {
  if (!code || typeof code !== 'string') return null
  return db.prepare('SELECT * FROM invite_codes WHERE code = ?').get(code.trim())
}

const createInviteCode = (code, maxUses = (parseInt(process.env.INVITE_CODE_MAX_USES, 10) || 100)) => {
  const trimmed = (code || '').trim()
  if (!trimmed) throw new Error('Invite code cannot be empty')
  const timestamp = now()
  db.prepare(`
    INSERT OR IGNORE INTO invite_codes (code, used, use_count, max_uses, created_at)
    VALUES (?, 0, 0, ?, ?)
  `).run(trimmed, maxUses, timestamp)
  return getInviteCode(trimmed)
}

const validateInviteCode = (code) => {
  const row = getInviteCode(code)
  if (!row) return { valid: false, message: '邀请码不存在' }
  const maxUses = typeof row.max_uses === 'number' ? row.max_uses : 100
  const useCount = typeof row.use_count === 'number' ? row.use_count : (row.used ? 1 : 0)
  if (row.used || useCount >= maxUses) return { valid: false, message: '邀请码已被使用或已达上限' }
  return { valid: true, row }
}

const registerLocalUser = async ({ username, email, password, inviteCode } = {}) => {
  const trimmedUser = (username || '').trim()
  const trimmedEmail = (email || '').trim().toLowerCase()
  const trimmedCode = (inviteCode || '').trim()

  if (!trimmedCode) {
    throw new Error('请输入邀请码')
  }
  if (!trimmedUser) {
    throw new Error('请输入用户名')
  }
  if (!/^[a-zA-Z0-9_-]{3,30}$/.test(trimmedUser)) {
    throw new Error('用户名须为 3-30 位的字母、数字、下划线或中划线')
  }
  if (RESERVED_USERNAMES.has(trimmedUser.toLowerCase())) {
    throw new Error('该用户名已被系统保留，请更换其他用户名')
  }
  if (!trimmedEmail) {
    throw new Error('请输入邮箱')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error('邮箱格式不正确')
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new Error('密码长度至少为 6 位')
  }
  if (password.length > 64) {
    throw new Error('密码长度不能超过 64 位')
  }

  // 检查用户名是否重复
  const existingLogin = db.prepare('SELECT user_id FROM users WHERE lower(github_login) = lower(?)').get(trimmedUser)
  if (existingLogin) {
    throw new Error('该用户名已被注册')
  }

  // 检查邮箱是否重复
  const existingEmail = db.prepare('SELECT user_id FROM users WHERE lower(email) = lower(?)').get(trimmedEmail)
  if (existingEmail) {
    throw new Error('该邮箱已被注册')
  }

  // 检查邀请码有效性
  const codeRow = db.prepare('SELECT * FROM invite_codes WHERE code = ?').get(trimmedCode)
  if (!codeRow) {
    throw new Error('邀请码不存在')
  }
  const maxUses = typeof codeRow.max_uses === 'number' ? codeRow.max_uses : 100
  const useCount = typeof codeRow.use_count === 'number' ? codeRow.use_count : (codeRow.used ? 1 : 0)
  if (codeRow.used || useCount >= maxUses) {
    throw new Error('邀请码已被使用或已达上限')
  }

  const userId = randomUUID()
  const timestamp = now()
  const passwordHash = hashPassword(password)

  runTransaction(() => {
    const updateResult = db.prepare(`
      UPDATE invite_codes
      SET use_count = use_count + 1,
          used = CASE WHEN use_count + 1 >= max_uses THEN 1 ELSE 0 END,
          used_by = ?,
          used_at = ?
      WHERE code = ? AND use_count < max_uses
    `).run(userId, timestamp, trimmedCode)

    if (updateResult.changes === 0) {
      throw new Error('邀请码已被使用或已达上限')
    }

    db.prepare(`
      INSERT INTO invite_code_uses (code, user_id, used_at)
      VALUES (?, ?, ?)
    `).run(trimmedCode, userId, timestamp)

    const data = {
      userName: trimmedUser,
      email: trimmedEmail,
      login: trimmedUser,
      githubShare: true,
      openShare: true,
      initialed: true
    }

    db.prepare(`
      INSERT INTO users (user_id, github_login, email, password_hash, auth_provider, data, initialed, github_share, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'local', ?, 1, 1, ?, ?)
    `).run(
      userId,
      trimmedUser,
      trimmedEmail,
      passwordHash,
      stringifyJson(data),
      timestamp,
      timestamp
    )

    createResume(userId, trimmedUser)
  })

  return getUser({ userId })
}

const loginLocalUser = async ({ account, password } = {}) => {
  const trimmedAccount = (account || '').trim()
  if (!trimmedAccount) {
    throw new Error('请输入用户名或邮箱')
  }
  if (!password || typeof password !== 'string') {
    throw new Error('请输入密码')
  }

  const row = db.prepare(`
    SELECT * FROM users
    WHERE lower(github_login) = lower(?) OR lower(email) = lower(?)
  `).get(trimmedAccount, trimmedAccount)

  if (!row) {
    throw new Error('账号或密码错误')
  }

  if (row.auth_provider === 'github' && !row.password_hash) {
    throw new Error('该账号由 GitHub 授权登录，请使用 GitHub 登录')
  }

  if (!row.password_hash || !verifyPassword(password, row.password_hash)) {
    throw new Error('账号或密码错误')
  }

  return rowToUser(row)
}

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
  githubSections: sanitizeGithubSections(parseJson(row.github_sections, DEFAULT_GITHUB_SECTIONS)),
  updated_at: row.updated_at,
  created_at: row.created_at
})

const getResumeInfo = async (qs = {}) => rowToResumeInfo(findResumeRow(qs))

const getResume = async (qs = {}) => {
  const row = findResumeRow(qs)
  if (!row) return null
  const localesData = parseResumeLocales(row.data)
  const targetLocale = normalizeLocale(qs.locale)
  const resume = localesData[targetLocale] || localesData.zh || Object.values(localesData)[0] || defaultResume()

  const existingLocales = Object.keys(localesData).filter((loc) => {
    const data = localesData[loc]
    if (!data || typeof data !== 'object') return false
    return Boolean(
      (data.info && Object.keys(data.info).length)
      || (data.educations && data.educations.length)
      || (data.workExperiences && data.workExperiences.length)
      || (data.personalProjects && data.personalProjects.length)
    )
  })
  const localeIds = existingLocales.length ? existingLocales : ['zh']
  const sortedLocaleIds = ['zh', 'en'].filter(id => localeIds.includes(id))
  for (const id of localeIds) {
    if (!sortedLocaleIds.includes(id)) sortedLocaleIds.push(id)
  }
  const languages = sortedLocaleIds.map(id => RESUME_LANGUAGE_OPTIONS[id] || { id, text: id })

  return {
    resume,
    languages,
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

  const targetLocale = normalizeLocale(locale)
  const localesData = parseResumeLocales(row.data)
  localesData[targetLocale] = resume || defaultResume()

  const timestamp = now()
  db.prepare('UPDATE resumes SET data = ?, updated_at = ? WHERE user_id = ?')
    .run(stringifyJson({ _locales: localesData }), timestamp, targetUserId)
  return {
    ...(await getResumeInfo({ userId: targetUserId })),
    hash: row.resume_hash,
    locale: targetLocale,
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
    githubSections: sanitizeGithubSections(info.githubSections || parseJson(row.github_sections, DEFAULT_GITHUB_SECTIONS))
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
  getResumeCount: async () => db.prepare('SELECT COUNT(*) AS count FROM resumes').get().count,
  registerLocalUser,
  loginLocalUser,
  getInviteCode,
  createInviteCode,
  validateInviteCode
}
