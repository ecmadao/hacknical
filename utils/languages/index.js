const getLocale = (currentLanguage) => {
  let locale = currentLanguage || 'zh';
  if (locale === 'fr') { locale === 'en' }
  let datas = {};
  try {
    datas = require(`./${locale}.js`).default;
  } catch (e) {
    console.log(e)
  } finally {
    return datas;
  }
};

export default getLocale;
