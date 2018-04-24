
import cacheManager from 'cache-manager';
import logger from './logger';

const cache = cacheManager.caching({ store: 'memory', max: 3000 });

const getCacheKey = (args) => {
  let cacheKey = '';
  args.forEach((arg) => {
    if (Array.isArray(arg)) {
      cacheKey += `${arg.toString()}-`;
    } else if (Object.prototype.toString.call(arg) === '[object Object]') {
      cacheKey += `${JSON.stringify(arg)}-`;
    } else {
      cacheKey += `${arg}-`;
    }
  });
  cacheKey = cacheKey.slice(0, -1);
  if (cacheKey[0] === '-') cacheKey = cacheKey.slice(1);
  return cacheKey;
};

function wrapFn(fn, prefix = 'cache', options) {
  const finallyOptions = options || {};

  return (...args) => {
    let hitCache = true;
    const cacheKey = getCacheKey(args);

    return cache.wrap(`${prefix}-${fn.name}-${cacheKey}`, () => {
      hitCache = false;
      return fn(...args);
    }, finallyOptions).then((data) => {
      if (hitCache) {
        logger.info(`[FUNC-CACHE:GET][${cacheKey}]`);
      } else {
        logger.info(`[FUNC-CACHE:SET][${cacheKey}]`);
      }
      return data;
    });
  };
}

export default {
  wrapFn,
};
