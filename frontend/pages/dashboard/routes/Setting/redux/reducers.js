import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import dateHelper from 'UTILS/date';

const initialState = {
  loading: true,
  updateTime: null,
  resumeInfo: {
    loading: true,
    useGithub: true,
    openShare: true
  },
  githubInfo: {
    loading: true,
    openShare: true
  }
};

const reducers = handleActions({
  // github
  TOGGLE_SETTING_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },

  SET_UPDATE_TIME(state, action) {
    const updateRawTime = action.payload;
    const updateTime = updateRawTime ? dateHelper.relative.secondsBefore(updateRawTime) : state.updateTime;
    return ({
      ...state,
      updateTime,
      loading: false
    });
  },

  INITIAL_GITHUB_SHARE_INFO(state, action) {
    const { githubInfo } = state;
    const { openShare } = action.payload;
    return ({
      ...state,
      githubInfo: objectAssign({}, githubInfo, {
        openShare,
        loading: false
      })
    });
  },

  // resume
  INITIAL_RESUME_SHARE_INFO(state, action) {
    const { resumeInfo } = state;
    const { openShare, useGithub } = action.payload;
    return ({
      ...state,
      resumeInfo: objectAssign({}, resumeInfo, {
        openShare,
        useGithub,
        loading: false
      })
    });
  }
}, initialState)

export default reducers;
