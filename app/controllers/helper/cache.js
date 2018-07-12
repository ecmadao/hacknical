
import logger from '../../utils/logger';
import getCacheKey from './cacheKey';

const getCache = (key, options = {}) => async (ctx, next) => {
  const cacheKey = getCacheKey(ctx)(key, options);
  const result = await ctx.cache.get(cacheKey);
  if (result) {
    logger.info(`[REQUEST-CACHE:GET][${cacheKey}]`);
    ctx.body = {
      success: true,
      result,
    };
    return;
  }
  ctx.query.cacheKeys = [cacheKey];
  ctx.query.shouldCache = true;
  await next();
};

const setCache = (options = {}) => async (ctx) => {
  const { cacheKeys, shouldCache } = ctx.query;
  const { result } = ctx.body;
  const expire = options.expire || 86400 * 3; // three days

  if (cacheKeys && cacheKeys.length && result && shouldCache) {
    for (let i = 0; i < cacheKeys.length; i += 1) {
      const cacheKey = cacheKeys[i];
      logger.info(`[REQUEST-CACHE:SET][${cacheKey}]`);
      await ctx.cache.set(cacheKey, result, { expire });
    }
  }
};

const removeCache = (keys = []) => async (ctx) => {
  const targetKeys = ctx.query.deleteKeys || keys;
  for (let i = 0; i < targetKeys.length; i += 1) {
    logger.info(`[REQUEST-CACHE:DEL][${targetKeys[i]}]`);
    await ctx.cache.del(targetKeys[i]);
  }
};

export default {
  get: getCache,
  set: setCache,
  del: removeCache
};
