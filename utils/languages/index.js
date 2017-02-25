const getLocale = (currentLanguage) => {
  const locale = currentLanguage || 'en';
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
