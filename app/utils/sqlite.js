import fs from 'fs'
import path from 'path'
import { DatabaseSync } from 'node:sqlite'
import config from 'config'
import PATH from '../../config/path'
import { titleToPinyin } from './pinyin'

const storageConfig = config.get('storage')
const configuredPath = storageConfig.sqlite && storageConfig.sqlite.path
const databasePath = configuredPath
  ? path.resolve(PATH.ROOT_PATH, configuredPath)
  : path.join(PATH.ROOT_PATH, 'data', 'hacknical.sqlite')

const ensureParent = (filename) => {
  const parent = path.dirname(filename)
  if (!fs.existsSync(parent)) fs.mkdirSync(parent, { recursive: true })
}

ensureParent(databasePath)

const db = new DatabaseSync(databasePath)

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions (expires_at);

  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    github_login TEXT NOT NULL UNIQUE,
    data TEXT NOT NULL,
    initialed INTEGER NOT NULL DEFAULT 0,
    github_share INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resumes (
    resume_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resume_hash TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL DEFAULT '默认简历',
    pinyin TEXT NOT NULL DEFAULT '',
    is_default INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'v1',
    simplify_url INTEGER NOT NULL DEFAULT 1,
    open_share INTEGER NOT NULL DEFAULT 0,
    use_github INTEGER NOT NULL DEFAULT 0,
    autosave INTEGER NOT NULL DEFAULT 0,
    resume_sections TEXT NOT NULL,
    github_sections TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS github_cache (
    login TEXT NOT NULL,
    kind TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (login, kind)
  );

  CREATE TABLE IF NOT EXISTS view_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL,
    type TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT '',
    browser TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS view_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login TEXT NOT NULL,
    type TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS stats (
    type TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (type, action)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    message_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    locale TEXT NOT NULL DEFAULT '',
    data TEXT NOT NULL,
    read_at TEXT,
    vote INTEGER
  );

  CREATE TABLE IF NOT EXISTS invite_codes (
    code TEXT PRIMARY KEY,
    used INTEGER NOT NULL DEFAULT 0,
    use_count INTEGER NOT NULL DEFAULT 0,
    max_uses INTEGER NOT NULL DEFAULT 100,
    used_by TEXT,
    created_at TEXT NOT NULL,
    used_at TEXT
  );
  CREATE INDEX IF NOT EXISTS invite_codes_used ON invite_codes (used);

  CREATE TABLE IF NOT EXISTS invite_code_uses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    user_id TEXT NOT NULL,
    used_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_invite_code_uses_code ON invite_code_uses (code);
`)

// Migrate users table columns if not present
const userColumns = new Set(db.prepare('PRAGMA table_info(users)').all().map(col => col.name))
if (!userColumns.has('email')) {
  db.exec('ALTER TABLE users ADD COLUMN email TEXT')
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL AND email != ''")
}
if (!userColumns.has('password_hash')) {
  db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT')
}
if (!userColumns.has('auth_provider')) {
  db.exec('ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT "github"')
}

// Migrate invite_codes table columns if not present
const inviteColumns = new Set(db.prepare('PRAGMA table_info(invite_codes)').all().map(col => col.name))
if (!inviteColumns.has('use_count')) {
  db.exec('ALTER TABLE invite_codes ADD COLUMN use_count INTEGER NOT NULL DEFAULT 0')
  db.exec('UPDATE invite_codes SET use_count = 1 WHERE used = 1')
}
if (!inviteColumns.has('max_uses')) {
  db.exec('ALTER TABLE invite_codes ADD COLUMN max_uses INTEGER NOT NULL DEFAULT 100')
}

// Migrate resumes table to support multiple resumes per user
const resumeColumns = new Set(db.prepare('PRAGMA table_info(resumes)').all().map(col => col.name))
if (resumeColumns.size > 0 && !resumeColumns.has('resume_id')) {
  db.exec('PRAGMA foreign_keys = OFF;')
  db.exec(`
    ALTER TABLE resumes RENAME TO resumes_old;

    CREATE TABLE resumes (
      resume_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
      resume_hash TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL DEFAULT '默认简历',
      pinyin TEXT NOT NULL DEFAULT '',
      is_default INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL,
      template TEXT NOT NULL DEFAULT 'v1',
      simplify_url INTEGER NOT NULL DEFAULT 1,
      open_share INTEGER NOT NULL DEFAULT 0,
      use_github INTEGER NOT NULL DEFAULT 0,
      autosave INTEGER NOT NULL DEFAULT 0,
      resume_sections TEXT NOT NULL,
      github_sections TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    INSERT INTO resumes (
      resume_id, user_id, resume_hash, title, pinyin, is_default,
      data, template, simplify_url, open_share, use_github, autosave,
      resume_sections, github_sections, created_at, updated_at
    )
    SELECT
      lower(hex(randomblob(16))), user_id, resume_hash, '默认简历', 'morenjianli', 1,
      data, template, simplify_url, open_share, use_github, autosave,
      resume_sections, github_sections, created_at, updated_at
    FROM resumes_old;

    DROP TABLE resumes_old;
  `)
  db.exec('PRAGMA foreign_keys = ON;')
} else {
  if (resumeColumns.has('resume_id') && !resumeColumns.has('title')) {
    db.exec("ALTER TABLE resumes ADD COLUMN title TEXT NOT NULL DEFAULT '默认简历'")
  }
  if (resumeColumns.has('resume_id') && !resumeColumns.has('pinyin')) {
    db.exec("ALTER TABLE resumes ADD COLUMN pinyin TEXT NOT NULL DEFAULT ''")
  }
  if (resumeColumns.has('resume_id') && !resumeColumns.has('is_default')) {
    db.exec('ALTER TABLE resumes ADD COLUMN is_default INTEGER NOT NULL DEFAULT 0')
  }
}

// Populate pinyin for any existing rows that have empty pinyin
const existingResumeCols = new Set(db.prepare('PRAGMA table_info(resumes)').all().map(col => col.name))
if (existingResumeCols.has('pinyin')) {
  const emptyPinyinRows = db.prepare("SELECT resume_id, title FROM resumes WHERE pinyin = '' OR pinyin IS NULL").all()
  if (emptyPinyinRows && emptyPinyinRows.length > 0) {
    const updatePinyinStmt = db.prepare('UPDATE resumes SET pinyin = ? WHERE resume_id = ?')
    for (const r of emptyPinyinRows) {
      updatePinyinStmt.run(titleToPinyin(r.title), r.resume_id)
    }
  }
}

db.exec('CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes (user_id);')
db.exec('CREATE INDEX IF NOT EXISTS idx_resumes_resume_hash ON resumes (resume_hash);')
db.exec('CREATE INDEX IF NOT EXISTS idx_resumes_user_default ON resumes (user_id, is_default);')
db.exec('CREATE INDEX IF NOT EXISTS idx_resumes_user_pinyin ON resumes (user_id, pinyin);')

export const now = () => new Date().toISOString()

// Seed invite codes from env or default
const seedInviteCodes = () => {
  const envCodes = process.env.INVITE_CODES
  const codesToSeed = envCodes
    ? envCodes.split(/[,;\s]+/).map(c => c.trim()).filter(Boolean)
    : []
  const defaultMaxUses = parseInt(process.env.INVITE_CODE_MAX_USES, 10) || 100

  const timestamp = now()
  const insertStmt = db.prepare('INSERT OR IGNORE INTO invite_codes (code, used, use_count, max_uses, created_at) VALUES (?, 0, 0, ?, ?)')
  for (const code of codesToSeed) {
    insertStmt.run(code, defaultMaxUses, timestamp)
  }

  const count = db.prepare('SELECT COUNT(*) as total FROM invite_codes').get().total
  if (count === 0) {
    // If no invite code exists at all, seed a default code for instant usability
    insertStmt.run('HACKNICAL-2026', defaultMaxUses, timestamp)
  }
}

seedInviteCodes()

export const parseJson = (value, fallback = null) => {
  if (value === null || value === undefined || value === '') return fallback
  try {
    return JSON.parse(value)
  } catch (e) {
    return fallback
  }
}

export const stringifyJson = value => JSON.stringify(value === undefined ? null : value)

export default db
