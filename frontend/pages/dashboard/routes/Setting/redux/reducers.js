import { handleActions } from 'redux-actions';
import objectAssign from 'UTILS/object-assign';
import dateHelper from 'UTILS/date';

const initialState = {
  loading: true,
  updateTime: null,
  refreshEnable: false,
  resumeInfo: {
    loading: true,
    useGithub: false,
    openShare: false,
    github: {},
    disabled: true,
    simplifyUrl: true,
  },
  githubInfo: {
    loading: true,
    openShare: true,
    openModal: false,
    disabled: true,
  }
};

const reducers = handleActions({
  // github
  TOGGLE_GITHUB_MODAL(state, action) {
    const { githubInfo } = state;
    return ({
      ...state,
      githubInfo: objectAssign({}, githubInfo, {
        openModal: action.payload
      })
    });
  },

  TOGGLE_SETTING_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    });
  },

  SET_UPDATE_TIME(state, action) {
    const updateRawTime = action.payload;
    const updateTime = updateRawTime
      ? dateHelper.relative.secondsBefore(updateRawTime)
      : state.updateTime;
    return ({
      ...state,
      updateTime,
      refreshEnable: (new Date() - new Date(updateRawTime)) / (60 * 1000) > 10,
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
        loading: false,
        disabled: false,
      })
    });
  },

  // resume
  INITIAL_RESUME_SHARE_INFO(state, action) {
    const { resumeInfo } = state;
    const result = action.payload;
    const info = resumeInfo || {};
    const newResumeInfo = result ? objectAssign({}, info, {
      openShare: result.openShare,
      useGithub: result.useGithub,
      simplifyUrl: result.simplifyUrl,
      loading: false,
      disabled: false,
      github: result.github,
    }) : objectAssign({}, info, {
      loading: false,
      disabled: true,
    });
    return ({
      ...state,
      resumeInfo: newResumeInfo
    });
  }
}, initialState)

export default reducers;
