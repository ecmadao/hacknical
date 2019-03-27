
import redisConnect from '../utils/redis'

/*
 * Hash: resume
 * ---------> count: Number
 * ---------> download: Number
 * ---------> pageview: Number
 *
 * Hash: github
 * ---------> count: Number
 * ---------> pageview: Number
 *
 * String: user
 * ---------> Number
 *
 * Hash: share-resume-login
 * ---------> login: String
 *            ---------> JSON.stringify({ userId, openShare, resumeHash })
 *
 * Hash: share-resume-hash
 * ---------> login: String
 *            ---------> JSON.stringify({ userId, login, openShare })
 *
 * Hash: resume-hash-map
 * ---------> resumeHashV0: String
 *            ---------> resumeHash
 */

export const redisMiddleware = () => async (ctx, next) => {
  ctx.cache = await redisConnect()
  await next()
}
