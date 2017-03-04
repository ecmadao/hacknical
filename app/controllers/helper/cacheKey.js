import getValue from '../../utils/helper';

const OPTIONS = {
  params: [],
  session: [],
  query: [],
  keys: []
};

const getCacheKey = (ctx) => (key, options = {}) => {
  let cacheKey = key;
  const cachekeys = Object.assign({}, OPTIONS, options);
  const { params, session, query, keys } = cachekeys;

  let result = null;
  for(let i = 0; i < keys.length; i++) {
    const keyPath = keys[i];
    result = getValue(ctx, keyPath);
    if (result) { break; }
  }
  if (result) {
    cacheKey = `${cacheKey}.${result}`;
  }

  const paramIds = params.map(param => ctx.params[param] || '').join('.');
  const sessionIds = session.map(s => ctx.session[s] || '').join('.');
  const queryIds = query.map(q => ctx.query[q] || '').join('.');

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
