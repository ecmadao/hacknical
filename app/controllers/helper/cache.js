
const getCache = (key, params = []) => async (ctx, next) => {
  const { login } = ctx.params;
  const { userId } = ctx.session;
  const paramIds = params.map(param => ctx.query[param] || '').join('.');
  let cacheKey = key;
  if (login) {
    cacheKey = `${cacheKey}.${login}`;
  }
  if (userId) {
    cacheKey = `${cacheKey}.${userId}`;
  }
  if (paramIds) {
    cacheKey = `${cacheKey}.${paramIds}`;
  }
  const result = await ctx.cache.get(cacheKey);
  if (result) {
    console.log(`request: ${key} get datas from cache`);
    ctx.body = {
      success: true,
      result
    };
    return;
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

export default {
  get: getCache,
  set: setCache
}
