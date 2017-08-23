import { createActions } from 'redux-actions';
import Api from 'API';

const {
  onAnalysisDataTabChange,
  toggleAnalysisDataLoading,
  initialAnalysisData,
  onPageViewTypeChange,
} = createActions(
  'ON_ANALYSIS_DATA_TAB_CHANGE',
  'TOGGLE_ANALYSIS_DATA_LOADING',
  'INITIAL_ANALYSIS_DATA',
  'ON_PAGE_VIEW_TYPE_CHANGE',
);

// github
const fetchGithubShareData = () => (dispatch) => {
  dispatch(toggleAnalysisDataLoading(true));
  Api.github.getShareRecords().then((result) => {
    dispatch(initialAnalysisData(result));
  });
};

// resume
const fetchResumeShareData = () => (dispatch) => {
  dispatch(toggleAnalysisDataLoading(true));
  Api.resume.getShareRecords().then((result) => {
    dispatch(initialAnalysisData(result));
  });
};

export default {
  onAnalysisDataTabChange,
  toggleAnalysisDataLoading,
  initialAnalysisData,
  onPageViewTypeChange,
  // github
  fetchGithubShareData,
  // resume
  fetchResumeShareData,
};
