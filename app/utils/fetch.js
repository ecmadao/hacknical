import request from 'request'
import config from 'config'
import iconv from 'iconv-lite'
import logger from './logger'
import getSignature from './signature'
import { REQUEST_JSON_METHODS } from './constant'
import NewError from './error'

const name = config.get('appName')

const verify = (options = {}, appName = name) => {
  const { json = true } = options

  if (!options.headers) options.headers = {}
  const { body } = options
  const date = new Date().toString()
  options.headers.Date = date
  options.headers['X-App-Name'] = appName
  options.json = json

  try {
    const auth = config.get(`services.${options.source}.auth`)
    delete options.source
    let contentType = ''
    if (REQUEST_JSON_METHODS.find(method => method === options.method)) {
      contentType = 'application/json'
      options.headers['Content-Type'] = contentType
    }

    if (auth) {
      const { secretKey, publicKey } = auth
      const signature = getSignature({
        ...options,
        date,
        secretKey,
        contentType,
        body: body ? JSON.stringify(body) : ''
      })
      options.headers.Authorization = `Bearer ${publicKey}:${signature}`
    }
  } catch (e) {
    logger.error(e)
  }
}

const fetchData = options => new Promise((resolve, reject) => {
  request(options, (err, httpResponse, body) => {
    if (err) {
      reject(err)
    }
    if (body) {
      if (Buffer.isBuffer(body)) {
        resolve(iconv.decode(body, 'gbk'))
      }
      resolve(body.result || body)
    }
    reject(
      new NewError.ServerError(`Unknown Error when fetch: ${JSON.stringify(options)}`)
    )
  })
})

const fetch = async (options, timeouts = [2000]) => {
  verify(options)

  let err = null
  for (let i = 0; i < timeouts.length; i += 1) {
    try {
      const time = timeouts[i]
      if (time) {
        options.timeout = time
      }
      logger.info(`[FETCH:START] ${JSON.stringify(options)}`)
      const result = await fetchData(options)
      err = null
      return result
    } catch (e) {
      err = e
    }
  }
  if (err) {
    throw new NewError.ServerError(`${JSON.stringify(options)} - ${err.message} - ${err.stack}`)
  }
}

const handler = {
  get: (_, method) => {
    return (...args) => {
      const [options, timeouts] = args
      options.method = method.toUpperCase()
      return fetch(options, timeouts)
    }
  }
}

const proxy = new Proxy({}, handler)
export default proxy
