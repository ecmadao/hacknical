import db, { parseJson, stringifyJson } from './sqlite'

// Only an opaque session ID is sent to the browser. OAuth tokens stay in SQLite.
export default {
  async get(key) {
    const row = db.prepare('SELECT data FROM sessions WHERE id = ? AND expires_at > ?').get(key, Date.now())
    return row ? parseJson(row.data) : null
  },
  async set(key, value, maxAge) {
    const timestamp = Date.now()
    const expiresAt = value.githubTokenExpiresAt
      ? Math.min(timestamp + maxAge, value.githubTokenExpiresAt) : timestamp + maxAge
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(timestamp)
    db.prepare(`
      INSERT INTO sessions (id, data, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at
    `).run(key, stringifyJson(value), expiresAt)
  },
  async destroy(key) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(key)
  }
}
