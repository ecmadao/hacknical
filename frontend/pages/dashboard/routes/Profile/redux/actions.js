import { createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  // github
  toggleGithubLoading,
  initialGithubShareData,
  // resume
  toggleResumeLoading,
  initialResumeShareData
} = createActions(
  'TOGGLE_GITHUB_LOADING',
  'INITIAL_GITHUB_SHARE_DATA',
  'TOGGLE_RESUME_LOADING',
  'INITIAL_RESUME_SHARE_DATA',
);

// github
const fetchGithubShareData = () => (dispatch, getState) => {
  Api.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareData(result));
  });
};

// resume
const fetchResumeShareData = () => (dispatch, getState) => {
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
}
