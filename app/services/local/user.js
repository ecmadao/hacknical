import { randomUUID } from 'node:crypto'
import db, { now, parseJson, stringifyJson } from '../../utils/sqlite'
import { hashPassword, verifyPassword } from '../../utils/password'
import { titleToPinyin } from '../../utils/pinyin'

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

const getUniquePinyin = (userId, title, currentResumeId = null) => {
  const base = titleToPinyin(title)
  let candidate = base
  let counter = 1
  while (true) {
    const existing = db.prepare(
      'SELECT resume_id FROM resumes WHERE user_id = ? AND pinyin = ? AND resume_id != ?'
    ).get(String(userId), candidate, String(currentResumeId || ''))
    if (!existing) {
      return candidate
    }
    counter += 1
    candidate = `${base}-${counter}`
  }
}

const createResume = (userId, login, options = {}) => {
  const timestamp = now()
  const resumeId = randomUUID()
  const hash = randomUUID().replace(/-/g, '').slice(0, 16)

  const existingCount = (db.prepare('SELECT COUNT(*) AS total FROM resumes WHERE user_id = ?').get(String(userId)) || {}).total || 0
  const isDefault = existingCount === 0 ? 1 : (options.isDefault ? 1 : 0)

  let resumeData = stringifyJson({ _locales: { zh: defaultResume() } })
  let template = 'v1'
  let simplifyUrl = 1
  let resumeSections = stringifyJson(DEFAULT_RESUME_SECTIONS)
  let githubSections = stringifyJson(DEFAULT_GITHUB_SECTIONS)
  const title = (options.title || '').trim() || (existingCount === 0 ? '默认简历' : `我的简历 ${existingCount + 1}`)
  const pinyin = getUniquePinyin(userId, title)

  if (options.copyFromResumeId) {
    const source = db.prepare('SELECT * FROM resumes WHERE resume_id = ? AND user_id = ?').get(String(options.copyFromResumeId), String(userId))
    if (source) {
      resumeData = source.data
      template = source.template
      simplifyUrl = source.simplify_url
      resumeSections = source.resume_sections
      githubSections = source.github_sections
    }
  }

  if (isDefault) {
    db.prepare('UPDATE resumes SET is_default = 0 WHERE user_id = ?').run(String(userId))
  }

  db.prepare(`
    INSERT INTO resumes
      (resume_id, user_id, resume_hash, title, pinyin, is_default, data, template, simplify_url, open_share,
       use_github, autosave, resume_sections, github_sections, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?)
  `).run(
    resumeId,
    userId,
    hash,
    title,
    pinyin,
    isDefault,
    resumeData,
    template,
    simplifyUrl,
    resumeSections,
    githubSections,
    timestamp,
    timestamp
  )
  return getResumeInfo({ resumeId, userId, login })
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
  if (qs.resumeId) {
    if (qs.userId) {
      const row = db.prepare(`
        SELECT r.*, u.github_login FROM resumes r
        JOIN users u ON u.user_id = r.user_id
        WHERE r.resume_id = ? AND r.user_id = ?
      `).get(String(qs.resumeId), String(qs.userId))
      if (row) return row
    }
    const row = db.prepare(`
      SELECT r.*, u.github_login FROM resumes r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.resume_id = ?
    `).get(String(qs.resumeId))
    if (row) return row
  }
  if (qs.pinyin) {
    if (qs.userId) {
      const row = db.prepare(`
        SELECT r.*, u.github_login FROM resumes r
        JOIN users u ON u.user_id = r.user_id
        WHERE r.pinyin = ? AND r.user_id = ?
      `).get(String(qs.pinyin), String(qs.userId))
      if (row) return row
    }
  }
  if (qs.hash) {
    return db.prepare(`
      SELECT r.*, u.github_login FROM resumes r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.resume_hash = ?
    `).get(String(qs.hash))
  }
  if (qs.userId) {
    let row = db.prepare(`
      SELECT r.*, u.github_login FROM resumes r
      JOIN users u ON u.user_id = r.user_id
      WHERE r.user_id = ? AND r.is_default = 1
    `).get(String(qs.userId))
    if (!row) {
      row = db.prepare(`
        SELECT r.*, u.github_login FROM resumes r
        JOIN users u ON u.user_id = r.user_id
        WHERE r.user_id = ?
        ORDER BY r.created_at ASC LIMIT 1
      `).get(String(qs.userId))
    }
    return row
  }
  const login = qs.login || qs.githubLogin
  if (login) {
    const userRow = findUserRow({ login })
    if (userRow) {
      return findResumeRow({ userId: userRow.user_id, pinyin: qs.pinyin })
    }
  }
  return null
}

const rowToResumeInfo = row => row && ({
  resumeId: row.resume_id,
  userId: row.user_id,
  login: row.github_login,
  title: row.title || '默认简历',
  pinyin: row.pinyin || titleToPinyin(row.title),
  isDefault: Boolean(row.is_default),
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
  let row = findResumeRow(qs)
  if (!row && qs.userId) {
    const user = await getUser({ userId: qs.userId })
    if (user) {
      createResume(user.userId, user.login)
      row = findResumeRow(qs)
    }
  }
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
    resumeId: row.resume_id,
    title: row.title || '默认简历',
    isDefault: Boolean(row.is_default),
    resume,
    languages,
    updated_at: row.updated_at,
    created_at: row.created_at
  }
}

const updateResume = async ({
  userId, login, resumeId, resume, locale
}) => {
  let targetUserId = userId
  let row = findResumeRow({ resumeId, userId: targetUserId })
  if (!row && login) {
    const user = await getUser({ login })
    if (user) {
      createResume(user.userId, login)
      row = findResumeRow({ userId: user.userId })
      targetUserId = user.userId
    }
  }
  if (!row && targetUserId) {
    createResume(targetUserId, login || '')
    row = findResumeRow({ userId: targetUserId })
  }
  if (!row) throw new Error('User resume does not exist')

  const targetLocale = normalizeLocale(locale)
  const localesData = parseResumeLocales(row.data)
  localesData[targetLocale] = resume || defaultResume()

  const timestamp = now()
  db.prepare('UPDATE resumes SET data = ?, updated_at = ? WHERE resume_id = ?')
    .run(stringifyJson({ _locales: localesData }), timestamp, row.resume_id)
  return {
    ...(await getResumeInfo({ resumeId: row.resume_id, userId: targetUserId })),
    resumeId: row.resume_id,
    title: row.title || '默认简历',
    isDefault: Boolean(row.is_default),
    hash: row.resume_hash,
    locale: targetLocale,
    newResume: false
  }
}

const setResumeInfo = async ({ userId, login, resumeId, info = {} }) => {
  let targetUserId = userId
  let row = findResumeRow({ resumeId, userId: targetUserId })
  if (!row && login) {
    const user = await getUser({ login })
    if (user) {
      createResume(user.userId, login)
      row = findResumeRow({ userId: user.userId })
      targetUserId = user.userId
    }
  }
  if (!row && targetUserId) {
    createResume(targetUserId, login || '')
    row = findResumeRow({ userId: targetUserId })
  }
  if (!row) return null

  const title = info.title !== undefined ? (String(info.title).trim() || row.title) : row.title
  const values = {
    title,
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
    SET title = ?, template = ?, simplify_url = ?, open_share = ?, use_github = ?, autosave = ?,
        resume_sections = ?, github_sections = ?, updated_at = ?
    WHERE resume_id = ?
  `).run(
    values.title,
    values.template,
    values.simplifyUrl,
    values.openShare,
    values.useGithub,
    values.autosave,
    stringifyJson(values.resumeSections),
    stringifyJson(values.githubSections),
    now(),
    row.resume_id
  )
  return getResumeInfo({ resumeId: row.resume_id, userId: targetUserId })
}

const getResumeList = async (userId) => {
  if (!userId) return []
  const rows = db.prepare(`
    SELECT resume_id, user_id, resume_hash, title, pinyin, is_default, template, open_share, simplify_url, created_at, updated_at
    FROM resumes
    WHERE user_id = ?
    ORDER BY is_default DESC, updated_at DESC
  `).all(String(userId))
  return rows.map(r => ({
    resumeId: r.resume_id,
    userId: r.user_id,
    resumeHash: r.resume_hash,
    title: r.title || '默认简历',
    pinyin: r.pinyin || titleToPinyin(r.title),
    isDefault: Boolean(r.is_default),
    template: r.template,
    openShare: Boolean(r.open_share),
    simplifyUrl: Boolean(r.simplify_url),
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }))
}

const createNewResume = async (userId, login, options = {}) => {
  let user = findUserRow({ userId })
  if (!user && login) user = findUserRow({ login })
  if (!user) throw new Error('用户不存在')
  const title = (options.title || '').trim() || '新建简历'
  return createResume(user.user_id, user.github_login, {
    title,
    copyFromResumeId: options.copyFromResumeId
  })
}

const setDefaultResume = async (userId, resumeId) => {
  const row = db.prepare('SELECT * FROM resumes WHERE resume_id = ? AND user_id = ?').get(String(resumeId), String(userId))
  if (!row) throw new Error('简历不存在')
  runTransaction(() => {
    db.prepare('UPDATE resumes SET is_default = 0 WHERE user_id = ?').run(String(userId))
    db.prepare('UPDATE resumes SET is_default = 1, updated_at = ? WHERE resume_id = ?').run(now(), String(resumeId))
  })
  return getResumeList(userId)
}

const deleteResume = async (userId, resumeId) => {
  const rows = db.prepare('SELECT * FROM resumes WHERE user_id = ?').all(String(userId))
  if (rows.length <= 1) {
    throw new Error('至少需要保留一份简历')
  }
  const target = rows.find(r => r.resume_id === String(resumeId))
  if (!target) throw new Error('简历不存在')

  runTransaction(() => {
    db.prepare('DELETE FROM resumes WHERE resume_id = ?').run(String(resumeId))
    if (target.is_default) {
      const remaining = db.prepare('SELECT resume_id FROM resumes WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1').get(String(userId))
      if (remaining) {
        db.prepare('UPDATE resumes SET is_default = 1 WHERE resume_id = ?').run(remaining.resume_id)
      }
    }
  })
  return getResumeList(userId)
}

const renameResume = async (userId, resumeId, title) => {
  const trimmed = (title || '').trim()
  if (!trimmed) throw new Error('简历名称不能为空')
  const row = db.prepare('SELECT * FROM resumes WHERE resume_id = ? AND user_id = ?').get(String(resumeId), String(userId))
  if (!row) throw new Error('简历不存在')
  const newPinyin = getUniquePinyin(userId, trimmed, resumeId)
  db.prepare('UPDATE resumes SET title = ?, pinyin = ?, updated_at = ? WHERE resume_id = ?').run(trimmed, newPinyin, now(), String(resumeId))
  return getResumeInfo({ resumeId, userId })
}

const toggleResumeShare = async (userId, resumeId, openShare) => {
  const row = db.prepare('SELECT * FROM resumes WHERE resume_id = ? AND user_id = ?').get(String(resumeId), String(userId))
  if (!row) throw new Error('简历不存在')
  const targetShare = openShare !== undefined ? (openShare ? 1 : 0) : (row.open_share ? 0 : 1)
  db.prepare('UPDATE resumes SET open_share = ?, updated_at = ? WHERE resume_id = ?').run(targetShare, now(), String(resumeId))
  return getResumeList(userId)
}

const copyResume = async (userId, login, resumeId, title) => {
  let user = findUserRow({ userId })
  if (!user && login) user = findUserRow({ login })
  if (!user) throw new Error('用户不存在')
  const row = db.prepare('SELECT * FROM resumes WHERE resume_id = ? AND user_id = ?').get(String(resumeId), String(user.user_id))
  if (!row) throw new Error('原简历不存在')
  const targetTitle = (title || '').trim() || `${row.title} (副本)`
  return createResume(user.user_id, user.github_login, {
    title: targetTitle,
    copyFromResumeId: resumeId
  })
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
  validateInviteCode,
  getResumeList,
  createNewResume,
  setDefaultResume,
  deleteResume,
  renameResume,
  copyResume,
  toggleResumeShare
}
