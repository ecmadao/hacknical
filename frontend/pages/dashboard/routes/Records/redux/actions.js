
import { createActions } from 'redux-actions'
import API from 'API'
import { LOGS_COUNT } from 'UTILS/constant/records'

const {
  onTabChange,
  toggleLoading,
  initialAnalysisData,
  initialLogsData,
  onPageViewTypeChange,
} = createActions(
  'ON_TAB_CHANGE',
  'TOGGLE_LOADING',
  'INITIAL_ANALYSIS_DATA',
  'INITIAL_LOGS_DATA',
  'ON_PAGE_VIEW_TYPE_CHANGE',
)

const fetchRecordsData = tab => (dispatch) => {
  dispatch(toggleLoading({ loading: true, key: 'recordsLoading' }))
  API[tab.toLowerCase()].getShareRecords().then((result) => {
    dispatch(initialAnalysisData(result))
  })
}

const fetchLogsData = tab => (dispatch) => {
  dispatch(toggleLoading({ loading: true, key: 'logsLoading' }))
  API[tab.toLowerCase()].getViewLogs({ limit: LOGS_COUNT }).then((result) => {
    dispatch(initialLogsData(result))
  })
}

export default {
  onTabChange,
  toggleLoading,
  initialAnalysisData,
  onPageViewTypeChange,
  // records
  fetchRecordsData,
  // view logs
  fetchLogsData,
}
