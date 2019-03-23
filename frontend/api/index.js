/* eslint global-require: "off" */

import 'proxy-polyfill/src/proxy'

const routeHandler = {
  get: (_, r) => {
    const route = r.toLowerCase()
    const fetch = require(`./${route}.js`)
    return fetch.default
  }
}

function target() {}
export default new Proxy(target, routeHandler)
