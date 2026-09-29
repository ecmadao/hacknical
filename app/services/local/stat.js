import db, { now, parseJson, stringifyJson } from '../../utils/sqlite'

const matches = (row, query = {}) => {
  if (query.login && row.login !== query.login) return false
  if (query.type && row.type !== query.type) return false
  return true
}

const getRecords = async (query = {}) => {
  const rows = db.prepare('SELECT * FROM view_records ORDER BY created_at ASC').all()
    .filter(row => matches(row, query))
  const devices = {}
  const sources = {}
  const days = {}
  rows.forEach((row) => {
    const platform = row.platform || ''
    const browser = row.browser || ''
    const date = row.created_at.slice(0, 10)
    devices[platform] = (devices[platform] || 0) + 1
    sources[browser] = (sources[browser] || 0) + 1
    days[date] = (days[date] || 0) + 1
  })
  return [{
    viewDevices: Object.keys(devices).map(platform => ({ platform, count: devices[platform] })),
    viewSources: Object.keys(sources).map(browser => ({ browser, count: sources[browser] })),
    pageViews: Object.keys(days).map(date => ({ date, count: days[date] }))
  }]
}

const putRecords = async (data = {}) => {
  db.prepare(`
    INSERT INTO view_records (login, type, platform, browser, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.login || '', data.type || '', data.platform || '', data.browser || '', now())
  return true
}

const getLogs = async (query = {}) => {
  const limit = Number(query.limit) || 100
  const filters = parseJson(query.qs, {}) || {}
  const rows = db.prepare('SELECT * FROM view_logs ORDER BY created_at DESC').all()
    .filter(row => matches(row, filters))
    .slice(0, limit)
  return rows.map(row => ({
    ...parseJson(row.data, {}),
    _id: String(row.id),
    login: row.login,
    type: row.type,
    createdAt: row.created_at,
    updatedAt: row.created_at
  }))
}

const putLogs = async (data = {}) => {
  const { login = '', type = '', ...others } = data
  db.prepare(`
    INSERT INTO view_logs (login, type, data, created_at)
    VALUES (?, ?, ?, ?)
  `).run(login, type, stringifyJson(others), now())
  return true
}

const getStat = async (query = {}) => {
  let rows = db.prepare('SELECT type, action, count FROM stats').all()
  if (query.type) rows = rows.filter(row => row.type === query.type)
  if (query.action) rows = rows.filter(row => row.action === query.action)
  return rows
}

const putStat = async (data = {}) => {
  const type = data.type || ''
  const action = data.action || ''
  const timestamp = now()
  db.prepare(`
    INSERT INTO stats (type, action, count, updated_at) VALUES (?, ?, 1, ?)
    ON CONFLICT(type, action) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at
  `).run(type, action, timestamp)
  return true
}

const getUnreadNotifies = async (userId, locale = '') => {
  const rows = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ? AND (locale = '' OR locale = ?)
      AND read_at IS NULL ORDER BY rowid DESC
  `).all(String(userId), locale)
  return rows.map(row => ({ ...parseJson(row.data, {}), messageId: row.message_id }))
}

const markNotifies = async (userId, messageIds = []) => {
  const statement = db.prepare('UPDATE notifications SET read_at = ? WHERE user_id = ? AND message_id = ?')
  messageIds.forEach(id => statement.run(now(), String(userId), String(id)))
  return true
}

const voteNotify = async (userId, body = {}) => {
  if (body.messageId) {
    db.prepare('UPDATE notifications SET vote = ? WHERE user_id = ? AND message_id = ?')
      .run(Number(body.vote) || 0, String(userId), String(body.messageId))
  }
  return true
}

export default {
  getRecords,
  getAllRecords: () => getRecords({}),
  putRecords,
  getLogs,
  putLogs,
  getStat,
  putStat,
  getUnreadNotifies,
  markNotifies,
  voteNotify,
  getNotifies: async () => []
}
