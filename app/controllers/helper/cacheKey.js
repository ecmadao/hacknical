const getCacheKey = (ctx) => (key, params = []) => {
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
  return cacheKey
};

export default getCacheKey;
