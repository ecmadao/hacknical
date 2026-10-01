import crypto from 'node:crypto'

export const hashPassword = (password) => {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string')
  }
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

export const verifyPassword = (password, storedHash) => {
  if (!password || !storedHash || typeof storedHash !== 'string') return false
  const [salt, key] = storedHash.split(':')
  if (!salt || !key) return false
  try {
    const keyBuffer = Buffer.from(key, 'hex')
    const derivedKey = crypto.scryptSync(password, salt, 64)
    if (keyBuffer.length !== derivedKey.length) return false
    return crypto.timingSafeEqual(keyBuffer, derivedKey)
  } catch {
    return false
  }
}

export default {
  hashPassword,
  verifyPassword
}
