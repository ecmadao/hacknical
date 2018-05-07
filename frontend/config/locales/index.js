/* eslint-disable import/no-dynamic-require, global-require */

const getQurtyLocale = () => {
  const { search } = window.location;
  const match = RegExp('locale=([^&]*)').exec(search);
  return match && match[1] ? match[1] : '';
};

const validateLocale = () => {
  const locale = window.locale || getQurtyLocale() || 'en';
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
