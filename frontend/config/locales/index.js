const getLocale = (page) => {
  const locale = window.locale || 'en';
  let datas = {};
  try {
    datas = require(`./${page}/${locale}.js`).default;
  } catch (e) {
    console.log(e)
  } finally {
    return datas;
  }
};

export default getLocale;
