import { createActions } from 'redux-actions';
import Api from 'API/index';

const {
  // github
  toggleGithubLoading,
  initialGithubShareData,
  // resume
  toggleResumeLoading,
  initialResumeShareData,
  onPageViewTypeChange,
} = createActions(
  'TOGGLE_GITHUB_LOADING',
  'INITIAL_GITHUB_SHARE_DATA',
  'TOGGLE_RESUME_LOADING',
  'INITIAL_RESUME_SHARE_DATA',
  'ON_PAGE_VIEW_TYPE_CHANGE',
);

// github
const fetchGithubShareData = () => (dispatch) => {
  Api.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareData(result));
  });
};

// resume
const fetchResumeShareData = () => (dispatch) => {
  Api.resume.getShareRecords().then((result) => {
    dispatch(initialResumeShareData(result));
  });
};

export default {
  // github
  toggleGithubLoading,
  initialGithubShareData,
  fetchGithubShareData,
  // resume
  toggleResumeLoading,
  initialResumeShareData,
  fetchResumeShareData,
  onPageViewTypeChange,
};
