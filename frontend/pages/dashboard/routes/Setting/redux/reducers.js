
import { handleActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import dateHelper from 'UTILS/date'
import { DEFAULT_GITHUB_SECTIONS } from 'UTILS/constant/github'
import { DEFAULT_RESUME_SECTIONS } from 'UTILS/constant/resume'

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
    reminder: {},
    disabled: true,
    simplifyUrl: true,
    githubSections: [],
    resumeSections: [],
  },
  githubInfo: {
    url: '',
    loading: true,
    openShare: true,
    disabled: true
  }
}

const reducers = handleActions({
  // github
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
    const { resumeInfo = {} } = state
    const payload = action.payload || {}

    return ({
      ...state,
      resumeInfo: objectAssign({}, resumeInfo, payload, {
        loading: false,
        disabled: false,
        githubSections: payload.githubSections || [...DEFAULT_GITHUB_SECTIONS],
        resumeSections: payload.resumeSections || [...DEFAULT_RESUME_SECTIONS]
      }),
    })
  }
}, initialState)

export default reducers
