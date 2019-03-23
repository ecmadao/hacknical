/* eslint no-param-reassign: "off" */

import { polyfill } from 'es6-promise'
import param from 'jquery-param'
import 'isomorphic-fetch'
import NProgress from 'nprogress'
import message from 'UTILS/message'

require('nprogress/nprogress.css')

polyfill()
const rnoContent = /^(?:GET|HEAD)$/

const fetchApi = (url, method, data) => {
  url = `/api${url}`
  NProgress.start()
  NProgress.set(0.4)
  const options = {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json,text/plain,*/*'
    }
  }
  if (rnoContent.test(method)) {
    const query = param(data)
    if (query) {
      url = url + (/\?$/.test(url) ? '&' : '?') + query
    }
  } else if (data) {
    options.body = JSON.stringify(data)
    options.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json,text/plain,*/*'
    }
  }

  return fetch(url, options)
    .then(response => response.json())
    .then((json) => {
      if (json.message) {
        message.notice(json.message)
      }
      if (json.error) {
        message.error(json.error)
      }
      if (json.url) {
        window.location = json.url
      }
      NProgress.done()
      return json.result || null
    }).catch((e) => {
      NProgress.done()
      throw new Error(`[Request Parsing Error] ${url} - ${JSON.stringify(options)}`, e.stack || e)
    })
}

const getCsrf = () => document.getElementsByTagName('meta')['csrf-token'].content

const _fetch = m => (url, data = {}) => {
  const csrf = getCsrf()
  const method = m.toUpperCase()
  if (!rnoContent.test(method)) data._csrf = csrf
  return fetchApi(
    url,
    method,
    data
  )
}

export default {
  get: _fetch('get'),
  post: _fetch('post'),
  put: _fetch('put'),
  delete: _fetch('delete'),
  patch: _fetch('patch')
}
