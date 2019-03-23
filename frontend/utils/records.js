
import { WECHAT } from 'UTILS/constant'

export const getValidateViewSources = (viewSources) => {
  const tmpSources = {}

  for (const viewSource of viewSources) {
    const {
      from,
      count,
      browser
    } = viewSource
    if (browser.toLowerCase() !== 'unknown' || WECHAT[from]) {
      let sourceBrowser = browser
      if (WECHAT[from]) {
        sourceBrowser = 'wechat'
      }
      if (tmpSources[sourceBrowser]) {
        tmpSources[sourceBrowser].count += count
      } else {
        tmpSources[sourceBrowser] = {
          count,
          browser: sourceBrowser
        }
      }
    }
  }
  return Object.keys(tmpSources).map(key => tmpSources[key])
}
