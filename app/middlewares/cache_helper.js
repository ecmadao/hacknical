import Redis from 'redis';
import wrapper from 'co-redis';


const redisCache = (redisUrl, options = {}) => {
  const prefix = options.prefix || 'hawkeye-cache:';
  const expire = options.expire || 86400; // one day

  let redisAvailable = false;

  const redisClient = wrapper(Redis.createClient(redisUrl, {
    prefix
  }));
  redisClient.on('error', (err)=> { redisAvailable = false; });
  redisClient.on('end', () => { redisAvailable = false; });
  redisClient.on('connect', () => { redisAvailable = true; });

  const setCache = async (key, value, options = {}) => {
    if(!redisAvailable){
      return;
    }
    if (value === null) {
      return;
    }
    const ttl = options.expire || expire;

    await redisClient.setex(`${prefix}${key}`, ttl, JSON.stringify(value));
  };

  const getCache = async (key) => {
    if(!redisAvailable){
      return;
    }
    const data = await redisClient.get(`${prefix}${key}`);
    if (!data) {
      return null;
    }
    return JSON.parse(data.toString())
  };

  const cacheMiddleware = async function(ctx, next) {
    ctx.cache = {
      get: getCache,
      set: setCache
    };
    await next();
  };

  return cacheMiddleware;
};

export default redisCache;
