import { handleActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import { getValidateViewSources } from 'UTILS/records'
import { VIEW_TYPES, RECORDS_SECTIONS } from 'UTILS/constant/records'

const initialState = {
  login: window.login,
  activeTab: RECORDS_SECTIONS.RESUME.ID,
  [RECORDS_SECTIONS.RESUME.ID]: {
    recordsLoading: false,
    logsLoading: false,
    recordsFetched: false,
    logsFetched: false,
    info: {
      url: '',
      openShare: false
    },
    totalPV: 0,
    viewDevices: [],
    viewSources: [],
    pageViews: [],
    viewLogs: [],
    viewType: VIEW_TYPES.DAILY.ID
  },
  [RECORDS_SECTIONS.GITHUB.ID]: {
    recordsLoading: false,
    logsLoading: false,
    recordsFetched: false,
    logsFetched: false,
    info: {
      url: '',
      openShare: false
    },
    totalPV: 0,
    viewDevices: [],
    viewSources: [],
    pageViews: [],
    viewLogs: [],
    viewType: VIEW_TYPES.DAILY.ID
  }
}

const reducers = handleActions({
  ON_TAB_CHANGE(state, action) {
    return ({
      ...state,
      activeTab: action.payload
    })
  },
  TOGGLE_LOADING(state, action) {
    const { activeTab } = state
    const { loading, key } = action.payload
    return ({
      ...state,
      [activeTab]: objectAssign({}, state[activeTab], {
        [key]: loading
      })
    })
  },

  INITIAL_ANALYSIS_DATA(state, action) {
    const { activeTab } = state
    const obj = state[activeTab]
    const {
      url = '',
      openShare = false,
      viewSources = [],
      ...others,
    } = (action.payload || {})

    return ({
      ...state,
      [activeTab]: objectAssign({}, obj, {
        recordsLoading: false,
        recordsFetched: true,
        info: objectAssign({}, obj.info, { url, openShare }),
        viewSources: getValidateViewSources(viewSources),
        ...others
      })
    })
  },

  INITIAL_LOGS_DATA(state, action) {
    const { activeTab } = state
    const obj = state[activeTab]
    const viewLogs = action.payload || []

    return ({
      ...state,
      [activeTab]: objectAssign({}, obj, {
        viewLogs: [...viewLogs],
        logsLoading: false,
        logsFetched: true
      })
    })
  },

  ON_PAGE_VIEW_TYPE_CHANGE(state, action) {
    const { activeTab } = state
    const obj = state[activeTab]
    return ({
      ...state,
      [activeTab]: objectAssign({}, obj, {
        viewType: action.payload
      })
    })
  },
}, initialState)

export default reducers
