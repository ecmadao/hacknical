/* eslint global-require: "off", import/no-dynamic-require: "off", no-unsafe-finally: "off" */

import config from 'config'
import path from 'path'
import fetch from '../../utils/fetch'
import cache from '../../utils/cache'
import NewError from '../../utils/error'
import { shadowImport } from '../../utils/files'

const protocolRegex = /^https?:/

const fetchApi = (baseUrl, source, timeouts) => (options = {}) => {
  const {
    ttl,
    url,
    useCache,
    method = 'get',
    ...others
  } = options

  const headExec = protocolRegex.exec(baseUrl)
  const protocol = headExec ? headExec[0] : 'http:'

  return fetch[method]({
    ...others,
    source,
    url: path.join(baseUrl, url || '').replace(protocolRegex, `${protocol}/`)
  }, timeouts)
}

const PREFIX = __dirname.split('/').slice(-1)[0]
const DELIVER = shadowImport(path.join(__dirname, 'lib'), {
  prefix: PREFIX,
  loader: (fullpath, baseName) => {
    const module = require(fullpath)
    const handler = {
      get(_, name) {
        if (!module[name]) {
          throw new NewError.UnknownError(`[INVALIDATE METHOD] unknown method ${name}`)
        }

        const service = config.get(`services.${baseName}`)
        const { url, timeouts } = service
        const request = fetchApi(url, baseName, timeouts)

        return (...args) => {
          const params = module[name](...args)
          if (params.useCache) {
            const getFromCache = cache.wrapFn(
              request, `hacknical-${baseName}`, { ttl: params.ttl || module.ttl || 60 }
            )
            return getFromCache(params)
          }
          return request(params)
        }
      }
    }

    function _target() {}
    const factory = new Proxy(_target, handler)
    return factory
  }
})

const handler = {
  get(_, name) {
    const key = `${PREFIX}.${name}`
    if (!DELIVER[Symbol.for(key)]) {
      throw new NewError.UnknownError(`[INVALIDATE SOURCE] unknown source ${name}`)
    }

    const deliver = DELIVER[Symbol.for(key)]
    return deliver
  }
}

function target() {}
const SenderFactory = new Proxy(target, handler)

export default SenderFactory
