
import config from 'config'
import IoRedis from 'ioredis'

const appName = config.get('appName')
const redisConfig = config.get('services.redis')

const redisConnect = async (prefix = appName.toUpperCase()) => {
  const dbConf = Object.assign({}, redisConfig, {
    keyPrefix: `${prefix}.`
  })
  const redisDB = await new IoRedis(dbConf)
  return redisDB
}

export default redisConnect
