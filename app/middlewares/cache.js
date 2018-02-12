import config from 'config';
import Redis from 'redis';
import wrapper from 'co-redis';
import logger from '../utils/logger';

/*
 * Hash: resume
 * ---------> count: Number
 * ---------> download: Number
 * ---------> pageview: Number
 *
 * Hash: github
 * ---------> count: Number
 * ---------> pageview: Number
 *
 * String: user
 * ---------> Number
 *
 * Hash: share-resume-login
 * ---------> login: String
 *            ---------> JSON.stringify({ userId, openShare, resumeHash })
 *
 * Hash: share-resume-hash
 * ---------> login: String
 *            ---------> JSON.stringify({ userId, login, openShare })
 *
 * Hash: resume-hash-map
 * ---------> resumeHashV0: String
 *            ---------> resumeHash
 */

const ONE_DAY = 86400;
// const FOREVER = -1;

const RedisCache = (options = {}) => {
  const prefix = options.prefix || `${config.get('appName')}:`;
  // const expire = options.expire || FOREVER;
  const { url } = options;

  let redisAvailable = false;

  const redisClient = wrapper(Redis.createClient({ url }, {
    prefix,
    parser: 'hiredis'
  }));
  logger.info(`[REDIS:CONNECT][Connected to redis: ${url}]`);
  redisClient.on('error', () => { redisAvailable = false; });
  redisClient.on('end', () => { redisAvailable = false; });
  redisClient.on('connect', () => { redisAvailable = true; });

  const setCache = async (key, value, option = {}) => {
    if (!redisAvailable) {
      return;
    }
    if (value === null) {
      return;
    }
    const ttl = option.expire || ONE_DAY;

    await redisClient.setex(`${prefix}${key}`, ttl, JSON.stringify(value));
  };

  const getCache = async (key) => {
    if (!redisAvailable) {
      return;
    }
    const data = await redisClient.get(`${prefix}${key}`);
    if (!data) {
      return null;
    }
    return JSON.parse(data.toString());
  };

  const removeCache = async (key) => {
    if (!redisAvailable) {
      return;
    }
    await redisClient.del(`${prefix}${key}`);
  };

  const incrCache = async (key) => {
    if (!redisAvailable) {
      return;
    }
    await redisClient.incr(`${prefix}${key}`);
  };

  const incrByCache = async (key, value) => {
    if (!redisAvailable) {
      return;
    }
    await redisClient.incrby(`${prefix}${key}`, value);
  };

  const hincrbyCahce = async (key, field, increment) => {
    if (!redisAvailable) {
      return;
    }
    await redisClient.hincrby(`${prefix}${key}`, field, increment);
  };

  const hgetCache = async (key, field) => {
    if (!redisAvailable) {
      return;
    }
    return await redisClient.hget(`${prefix}${key}`, field);
  };

  const hexistsCache = async (key, field) => {
    if (!redisAvailable) {
      return;
    }
    return await redisClient.hexists(`${prefix}${key}`, field);
  };

  const hdelCache = async (key, field) => {
    if (!redisAvailable) {
      return;
    }
    return await redisClient.hdel(`${prefix}${key}`, field);
  };

  const hsetCache = async (key, field, value) => {
    if (!redisAvailable) {
      return;
    }
    return await redisClient.hset(`${prefix}${key}`, field, value);
  };

  const hgetallCache = async (key) => {
    if (!redisAvailable) {
      return;
    }
    return await redisClient.hgetall(`${prefix}${key}`);
  };

  return {
    get: getCache,
    set: setCache,
    del: removeCache,
    incr: incrCache,
    incrby: incrByCache,
    hincrby: hincrbyCahce,
    hget: hgetCache,
    hgetall: hgetallCache,
    hexists: hexistsCache,
    hdel: hdelCache,
    hset: hsetCache
  };
};

let instance = null;

export const getRedis = (...params) => {
  if (instance) return instance;
  instance = new RedisCache(...params);
  return instance;
};

export const redisMiddleware = (...params) => {
  const cache = getRedis(...params);
  const cacheMiddleware = async (ctx, next) => {
    ctx.cache = cache;
    await next();
  };
  return cacheMiddleware;
};
