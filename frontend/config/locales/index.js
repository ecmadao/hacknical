export const validateLocale = () => {
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

const getLocale = (page) => {
  const locale = validateLocale();
  let datas = {};
  try {
    datas = require(`./${page}/${locale}.js`).default;
  } catch (e) {
    datas = require(`./${page}/en.js`).default;
  } finally {
    return datas;
  }
};

export default getLocale;
