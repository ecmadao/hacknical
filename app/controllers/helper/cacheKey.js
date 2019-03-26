import { getValue } from '../../utils/helper'

const getCacheKey = ctx => (key, options = {}) => {
  const results = [key]

  const cacheOptions = Object.assign({}, options)
  const { keys = [] } = cacheOptions
  delete cacheOptions.keys

  for (const keyPath of keys) {
    const result = getValue(ctx, keyPath)
    if (result) {
      results.push(result)
    }
  }

  for (const tmpKey of Object.keys(cacheOptions)) {
    const joinedResult = ctx[tmpKey]
      ? cacheOptions[tmpKey].map(s => ctx[tmpKey][s] || '').join('.')
      : ''
    if (joinedResult) {
      results.push(joinedResult)
    }
  }

  return results.join('.')
}

export default getCacheKey
