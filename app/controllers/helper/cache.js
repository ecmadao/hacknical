import getCacheKey from './cacheKey';

const getCache = (key, options = {}) => async (ctx, next) => {
  const cacheKey = getCacheKey(ctx)(key, options);
  const result = await ctx.cache.get(cacheKey);
  if (result) {
    return ctx.body = {
      success: true,
      result
    };
  }
  ctx.query.cacheKey = cacheKey;
  ctx.query.shouldCache = true;
  await next();
};

const setCache = (options = {}) => async (ctx, next) => {
  const { cacheKey, shouldCache } = ctx.query;
  const { result } = ctx.body;
  const expire = options.expire || 86400 * 3; // three days

  if (cacheKey && result && shouldCache) {
    await ctx.cache.set(cacheKey, result, { expire });
  }
};

const removeCache = (keys = []) => async (ctx, next) => {
  const targetKeys = ctx.query.deleteKeys || keys;
  for(let i = 0; i < targetKeys.length; i++) {
    await ctx.cache.del(targetKeys[i]);
  }
};

export default {
  get: getCache,
  set: setCache,
  del: removeCache
}
