
import { WECHAT } from 'UTILS/constant';

const WECHAT_FROM = Object.keys(WECHAT);

export const getValidateViewSources = (viewSources) => {
  const sources = [];

  for (const viewSource of viewSources) {
    const {
      from,
      count,
      browser,
    } = viewSource;
    if (browser.toLowerCase() !== 'unknown' || WECHAT_FROM.some(wechatFrom => wechatFrom === from)) {
      let sourceBrowser = browser;
      if (WECHAT_FROM.some(wechatFrom => wechatFrom === from)) {
        sourceBrowser = 'wechat';
      }
      const checkIfExist = sources.filter(source => source.browser === sourceBrowser);
      if (checkIfExist.length) {
        checkIfExist[0].count += count;
      } else {
        sources.push({
          count,
          browser: sourceBrowser,
        });
      }
    }
  }
  return sources;
};
