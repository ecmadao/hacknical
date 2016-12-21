
export const getCache = (key, params = []) => async (ctx, next) => {
  const userId = ctx.session.userId;
  const paramIds = params.map(param => ctx.query[param] || '').join('.');
  const cacheKey = `${key}.${userId}.${paramIds}`;
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
  await next();
};

export const setCache = (options = {}) => async (ctx, next) => {
  const { cacheKey } = ctx.query;
  const { result } = ctx.body;
  const expire = options.expire || 86400; // one day

  if (cacheKey && result) {
    console.log(`set cache of ${cacheKey}`);
    await ctx.cache.set(cacheKey, result, { expire });
  }
};

export default {
  get: getCache,
  set: setCache
}
