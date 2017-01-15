import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';

const initialState = {
  userInfo: {},
  viewDevices: [],
  viewSources: [],
  pageViews: []
};

const reducers = handleActions({
  INITIAL_GITHUB_SHARE_DATA(state, action) {
    const { userInfo } = state;
    const {
      url,
      viewDevices,
      viewSources,
      pageViews
    } = action.payload;
    return ({
      ...state,
      userInfo: objectAssign({}, userInfo, { url }),
      viewDevices: [...viewDevices],
      viewSources: [...viewSources],
      pageViews: [...pageViews],
    });
  },
}, initialState);

export default reducers;
