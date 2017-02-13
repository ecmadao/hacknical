import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  // github
  toggleGithubLoading,
  toggleGithubShareStatus,
  initialGithubShareData,
  // resume
  toggleResumeLoading,
  toggleResumeShareStatus,
  initialResumeShareData
} = createActions(
  'TOGGLE_GITHUB_LOADING',
  'TOGGLE_GITHUB_SHARE_STATUS',
  'INITIAL_GITHUB_SHARE_DATA',
  'TOGGLE_RESUME_LOADING',
  'TOGGLE_RESUME_SHARE_STATUS',
  'INITIAL_RESUME_SHARE_DATA',
);

// github
const fetchGithubShareData = () => (dispatch, getState) => {
  Api.github.getShareData().then((result) => {
    dispatch(initialGithubShareData(result));
  });
};

const postGithubShareStatus = () => (dispatch, getState) => {
  const { info } = getState().profile.github;
  const { openShare } = info;
  Api.github.toggleShare(!openShare).then((result) => {
    dispatch(toggleGithubShareStatus(!openShare));
  });
};

// resume
const fetchResumeShareData = () => (dispatch, getState) => {
  Api.resume.getShareData().then((result) => {
    dispatch(initialResumeShareData(result));
  });
};

const postResumeShareStatus = () => (dispatch, getState) => {
  const { info } = getState().profile.resume;
  const { openShare } = info;
  Api.resume.postPubResumeShareStatus(!openShare).then((result) => {
    dispatch(toggleResumeShareStatus(!openShare));
  });
};

export default {
  // github
  toggleGithubLoading,
  toggleGithubShareStatus,
  postGithubShareStatus,
  initialGithubShareData,
  fetchGithubShareData,
  // resume
  toggleResumeLoading,
  toggleResumeShareStatus,
  postResumeShareStatus,
  initialResumeShareData,
  fetchResumeShareData,
}
