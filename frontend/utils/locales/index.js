/* eslint-disable import/no-dynamic-require, global-require */

const getQurtyLocale = () => {
  const { search } = window.location
  const match = RegExp('locale=([^&]*)').exec(search)
  return match && match[1] ? match[1] : ''
}

export const switchLanguage = (locale) => {
  let lang = locale
  if (!lang) {
    lang = getLocale() === 'en' ? 'zh' : 'en'
  }

  window.location.href = `${window.location.origin}${window.location.pathname}?locale=${lang}`
}

export const getLocale = () => {
  const locale = window.locale || getQurtyLocale() || 'en'
  if (/^en/.test(locale)) {
    return 'en'
  }
  if (/^zh/.test(locale)) {
    return 'zh'
  }
  return 'zh'
}

export const formatLocale = () => {
  const locale = getLocale()
  if (/^en/.test(locale)) {
    return locale
  }
  if (/^zh/.test(locale)) {
    return 'zh-CN'
  }
  return 'zh-CN'
}

const getData = (dict, keys) => {
  let tmp = dict
  for (const key of keys) {
    tmp = tmp[key]
    if (!tmp) throw new Error(`Can not find ${keys.join('.')}`)
  }
  return tmp
}

const getLocaleData = () => {
  const tmp = new Map()
  const locale = getLocale()

  return (dataPath) => {
    const [file, ...dataKeys] = dataPath.split('.')
    if (tmp.has(file)) return getData(tmp.get(file), dataKeys)

    let datas = {}
    try {
      datas = require(`./${file}/${locale}.js`).default
    } catch (e) {
      datas = require(`./${file}/en.js`).default
    }
    tmp.set(file, datas)
    return getData(tmp.get(file), dataKeys)
  }
}

export default getLocaleData()
