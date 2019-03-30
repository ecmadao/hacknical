
import config from 'config'
import IoRedis from 'ioredis'

const appName = config.get('appName')
const redisConfig = config.get('services.redis')
let instance = null

const redisConnect = async (prefix = appName.toUpperCase()) => {
  if (instance) return instance

  const dbConf = Object.assign({}, redisConfig, {
    keyPrefix: `${prefix}.`
  })
  const redisDB = await new IoRedis(dbConf)
  instance = redisDB
  return instance
}

export default redisConnect
