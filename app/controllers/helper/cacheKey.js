const OPTIONS = {
  params: [],
  session: [],
  query: []
};

const getCacheKey = (ctx) => (key, options = {}) => {
  const cachekeys = Object.assign({}, OPTIONS, options);
  const { params, session, query } = cachekeys;

  const paramIds = params.map(param => ctx.params[param] || '').join('.');
  const sessionIds = session.map(s => ctx.session[s] || '').join('.');
  const queryIds = query.map(q => ctx.query[q] || '').join('.');

  let cacheKey = key;
  if (paramIds) {
    cacheKey = `${cacheKey}.${paramIds}`;
  }
  if (sessionIds) {
    cacheKey = `${cacheKey}.${sessionIds}`;
  }
  if (queryIds) {
    cacheKey = `${cacheKey}.${queryIds}`;
  }
  return cacheKey
};

export default getCacheKey;
