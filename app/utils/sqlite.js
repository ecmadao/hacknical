import fs from 'fs'
import path from 'path'
import { DatabaseSync } from 'node:sqlite'
import config from 'config'
import PATH from '../../config/path'

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
    user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    resume_hash TEXT NOT NULL UNIQUE,
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
`)

export const now = () => new Date().toISOString()

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
