import getCacheKey from './cacheKey';

const getCache = (key, options = {}) => async (ctx, next) => {
  const cacheKey = getCacheKey(ctx)(key, options);
  const result = await ctx.cache.get(cacheKey);
  if (result) {
    console.log(`request: ${cacheKey} get datas from cache`);
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
  const expire = options.expire || 86400; // one day

  if (cacheKey && result && shouldCache) {
    console.log(`set cache of ${cacheKey}`);
    await ctx.cache.set(cacheKey, result, { expire });
  }
};

const removeCache = (keys = []) => async (ctx, next) => {
  const targetKeys = ctx.query.deleteKeys || keys;
  console.log('remove cache');
  for(let i = 0; i < targetKeys.length; i++) {
    await ctx.cache.del(targetKeys[i]);
  }
};

export default {
  get: getCache,
  set: setCache,
  del: removeCache
}
