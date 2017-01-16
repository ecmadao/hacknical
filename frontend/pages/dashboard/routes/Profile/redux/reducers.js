import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';

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
      viewSources: [...viewSources],
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count)),
    });
  },
}, initialState);

export default reducers;
