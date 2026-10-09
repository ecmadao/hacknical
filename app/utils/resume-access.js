import { createHmac, timingSafeEqual } from 'node:crypto'
import config from 'config'

const DOWNLOAD_TOKEN_AGE = 15 * 60 * 1000
const secret = config.get('appKey')

const signature = (hash, expiresAt) => createHmac('sha256', secret)
  .update(`resume-download:${hash}:${expiresAt}`)
  .digest('hex')

export const createDownloadToken = (hash) => {
  const expiresAt = Date.now() + DOWNLOAD_TOKEN_AGE
  return `${expiresAt}.${signature(hash, expiresAt)}`
}

export const verifyDownloadToken = (hash, token) => {
  if (typeof hash !== 'string' || typeof token !== 'string') return false
  const match = /^(\d+)\.([a-f0-9]{64})$/.exec(token)
  if (!match) return false

  const expiresAt = Number(match[1])
  if (!Number.isSafeInteger(expiresAt) || expiresAt < Date.now()) return false
  if (expiresAt > Date.now() + DOWNLOAD_TOKEN_AGE) return false

  const actual = Buffer.from(match[2], 'hex')
  const expected = Buffer.from(signature(hash, expiresAt), 'hex')
  return timingSafeEqual(actual, expected)
}

export const canReadResume = (resumeInfo, session, downloadToken) => Boolean(
  resumeInfo && (
    resumeInfo.openShare
    || (session && session.userId && session.userId === resumeInfo.userId)
    || verifyDownloadToken(resumeInfo.resumeHash, downloadToken)
  )
)
