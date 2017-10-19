/* eslint-disable import/no-dynamic-require, global-require */

const validateLocale = () => {
  const locale = window.locale || 'en';
  if (/^en/.test(locale)) {
    return 'en';
  }
  if (/^fr/.test(locale)) {
    return 'fr';
  }
  if (/^zh/.test(locale)) {
    return 'zh';
  }
  return 'zh';
};

export const formatLocale = () => {
  const locale = validateLocale();
  if (/^en/.test(locale)) {
    return locale;
  }
  if (/^fr/.test(locale)) {
    return 'fr-FR';
  }
  if (/^zh/.test(locale)) {
    return 'zh-CN';
  }
  return 'zh-CN';
};

const getLocale = (page) => {
  const locale = validateLocale();
  let datas = {};
  try {
    datas = require(`./${page}/${locale}.js`).default;
  } catch (e) {
    datas = require(`./${page}/en.js`).default;
  }
  return datas;
};

export default getLocale;
