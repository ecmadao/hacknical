import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import WECHAT from 'SRC/data/wechat';

const WECHAT_FROM = Object.keys(WECHAT);
const initialState = {
  loading: true,
  userInfo: {
    url: '',
    openShare: false
  },
  viewDevices: [],
  viewSources: [],
  pageViews: []
};

const getValidateViewSources = (viewSources) => {
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
}

const reducers = handleActions({
  TOGGLE_SHARE_STATUS(state, action) {
    const { userInfo } = state;
    return ({
      ...state,
      userInfo: objectAssign({}, userInfo, { openShare: action.payload })
    });
  },

  TOGGLE_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },

  INITIAL_GITHUB_SHARE_DATA(state, action) {
    const { userInfo } = state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = action.payload;
    return ({
      ...state,
      loading: false,
      userInfo: objectAssign({}, userInfo, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count)),
    });
  },
}, initialState);

export default reducers;
