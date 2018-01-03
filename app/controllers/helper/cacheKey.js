import { getValue } from '../../utils/helper';

const getCacheKey = ctx => (key, options = {}) => {
  let cacheKey = key;
  const cacheOptions = Object.assign({}, options);
  const { keys = [] } = cacheOptions;
  delete cacheOptions.keys;
  const cachekeys = Object.keys(cacheOptions);

  for (let i = 0; i < keys.length; i += 1) {
    const keyPath = keys[i];
    const result = getValue(ctx, keyPath);
    if (result) {
      cacheKey = `${cacheKey}.${result}`;
    }
  }

  for (let i = 0; i < cachekeys.length; i += 1) {
    const tmpKey = cachekeys[i];
    const joinedResult = ctx[tmpKey]
      ? cacheOptions[tmpKey].map(s => ctx[tmpKey][s] || '').join('.')
      : '';
    if (joinedResult) {
      cacheKey = `${cacheKey}.${joinedResult}`;
    }
  }

  return cacheKey;
};

export default getCacheKey;
