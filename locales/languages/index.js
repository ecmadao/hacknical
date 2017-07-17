/* eslint global-require: "off" */

const getLocale = (currentLanguage) => {
  const locale = currentLanguage || 'zh';
  if (locale === 'fr') { locale === 'en' }
  let datas = {};
  try {
    datas = require(`./${locale}.js`).default;
  } catch (e) {
    console.log(e);
  }
  return datas;
};

export default getLocale;
