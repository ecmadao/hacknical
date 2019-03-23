/* eslint global-require: "off" */
import logger from '../../utils/logger'

const getLanguages = (currentLanguage) => {
  const locale = currentLanguage || 'zh'
  if (locale === 'fr') locale === 'en'
  let datas = []
  try {
    datas = require(`./${locale}.js`).default
  } catch (e) {
    logger.error(e)
  }
  return datas
}

export default getLanguages
