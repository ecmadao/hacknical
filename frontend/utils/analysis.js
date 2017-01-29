import WECHAT from 'SRC/data/wechat';

const WECHAT_FROM = Object.keys(WECHAT);

export const getValidateViewSources = (viewSources) => {
  const sources = [];
  viewSources.forEach((viewSource) => {
    const { count, browser, from } = viewSource;
    if (browser !== "unknown" || WECHAT_FROM.some(wechatFrom => wechatFrom === from)) {
      let sourceBrowser = browser;
      if (WECHAT_FROM.some(wechatFrom => wechatFrom === from)) { sourceBrowser = "wechat" }
      const checkIfExist = sources.filter(source => source.browser === sourceBrowser);
      if (checkIfExist.length) {
        checkIfExist[0].count += count;
      } else {
        sources.push({
          browser: sourceBrowser,
          count
        });
      }
    }
  });
  return sources;
};
