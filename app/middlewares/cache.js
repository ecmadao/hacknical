
import redisConnect from '../utils/redis'

export const redisMiddleware = () => async (ctx, next) => {
  ctx.cache = await redisConnect()
  await next()
}
