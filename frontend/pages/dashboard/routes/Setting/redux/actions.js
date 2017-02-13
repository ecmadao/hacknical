import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  toggleSettingLoading,
  setUpdateTime,
  initialResumeShareInfo
} = createActions(
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_TIME',
  'INITIAL_RESUME_SHARE_INFO'
);

// github data update
const fetchGithubUpdateTime = () => (dispatch, getState) => {
  Api.github.getUpdateTime().then((result) => {
    dispatch(setUpdateTime(result));
  });
};

const refreshGithubDatas = () => (dispatch, getState) => {
  dispatch(toggleSettingLoading(true));
  Api.github.refresh().then((result) => {
    dispatch(setUpdateTime(result));
  });
};

// resume
const fetchResumeShareInfo = () => (dispatch, getState) => {
  Api.resume.getPubResumeStatus().then((result) => {
    dispatch(initialResumeShareInfo(result.useGithub));
  });
};

const postResumeGithubStatus = () => (dispatch, getState) => {
  const { useGithub } = getState().setting.resumeInfo;
  Api.resume.postPubResumeGithubStatus(!useGithub).then((result) => {
    dispatch(initialResumeShareInfo(!useGithub));
  });
};


export default {
  // github
  toggleSettingLoading,
  setUpdateTime,
  fetchGithubUpdateTime,
  refreshGithubDatas,
  // resume
  initialResumeShareInfo,
  fetchResumeShareInfo,
  postResumeGithubStatus,
}
