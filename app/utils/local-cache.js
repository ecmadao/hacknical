const values = new Map()

const getTtl = (options) => {
  if (typeof options === 'number') return options
  if (options && typeof options.ttl === 'number') return options.ttl
  return 3600
}

const cleanup = (key, item) => {
  if (item && item.expiresAt && item.expiresAt <= Date.now()) {
    values.delete(key)
    return null
  }
  return item
}

export default {
  async get(key) {
    const item = cleanup(key, values.get(key))
    return item ? item.value : null
  },

  async set(key, value, options, maybeTtl) {
    // Keep the Redis-compatible `set(key, value, 'EX', ttl)` call used by
    // the existing middleware while also accepting cache-manager options.
    const ttl = typeof options === 'string' && options.toUpperCase() === 'EX'
      ? Number(maybeTtl)
      : getTtl(options)
    values.set(key, {
      value,
      expiresAt: Date.now() + ((Number.isFinite(ttl) ? ttl : 3600) * 1000)
    })
    return 'OK'
  },

  async expire(key, seconds) {
    const item = cleanup(key, values.get(key))
    if (!item) return 0
    if (Number(seconds) <= 0) {
      values.delete(key)
    } else {
      item.expiresAt = Date.now() + (Number(seconds) * 1000)
    }
    return 1
  },

  clear() {
    values.clear()
  }
}
