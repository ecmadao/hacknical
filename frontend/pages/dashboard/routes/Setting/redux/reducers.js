import { handleActions } from 'redux-actions';
import objectAssign from 'object-assign';
import dateHelper from 'UTILS/date';

const initialState = {
  loading: true,
  updateTime: null,
  resumeInfo: {
    loading: true,
    useGithub: false,
    openShare: false,
    github: {}
  },
  githubInfo: {
    loading: true,
    openShare: true,
    openModal: false
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
    const result = action.payload;
    let info = resumeInfo ? resumeInfo : {};
    const newResumeInfo = result ? objectAssign({}, info, {
      openShare: result.openShare,
      useGithub: result.useGithub,
      loading: false,
      github: result.github
    }) : null;
    return ({
      ...state,
      resumeInfo: newResumeInfo
    });
  }
}, initialState)

export default reducers;
