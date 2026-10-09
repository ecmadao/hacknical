
import redisConnect from '../utils/redis'
import localCache from '../utils/local-cache'
import config from 'config'

export const redisMiddleware = () => async (ctx, next) => {
  const cacheConfig = config.get('cache')
  ctx.cache = cacheConfig.driver === 'redis'
    ? await redisConnect()
    : localCache
  await next()
}
