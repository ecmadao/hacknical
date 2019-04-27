
import { handleActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import dateHelper from 'UTILS/date'

const initialState = {
  loading: true,
  login: window.login,
  updateTime: null,
  refreshEnable: false,
  resumeInfo: {
    url: '',
    loading: true,
    useGithub: false,
    openShare: false,
    github: {},
    reminder: {},
    disabled: true,
    simplifyUrl: true,
  },
  githubInfo: {
    url: '',
    loading: true,
    openShare: true,
    openModal: false,
    disabled: true,
  }
}

const reducers = handleActions({
  // github
  TOGGLE_GITHUB_MODAL(state, action) {
    const { githubInfo } = state
    return ({
      ...state,
      githubInfo: objectAssign({}, githubInfo, {
        openModal: action.payload
      })
    })
  },

  TOGGLE_SETTING_LOADING(state, action) {
    return ({
      ...state,
      loading: action.payload
    })
  },

  SET_UPDATE_STATUS(state, action) {
    const {
      refreshEnable,
      lastUpdateTime,
    } = action.payload
    const updateTime = lastUpdateTime
      ? dateHelper.relative.secondsBefore(lastUpdateTime)
      : state.updateTime
    return ({
      ...state,
      updateTime,
      refreshEnable,
      loading: false
    })
  },

  INITIAL_GITHUB_SHARE_INFO(state, action) {
    const { githubInfo } = state
    return ({
      ...state,
      githubInfo: objectAssign({}, githubInfo, action.payload, {
        loading: false,
        disabled: false,
      })
    })
  },

  // resume
  INITIAL_RESUME_SHARE_INFO(state, action) {
    const { resumeInfo } = state
    return ({
      ...state,
      resumeInfo: objectAssign({}, resumeInfo || {}, action.payload || {}, {
        loading: false,
        disabled: false
      })
    })
  }
}, initialState)

export default reducers
