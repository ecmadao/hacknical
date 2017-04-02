import { createAction, createActions } from 'redux-actions';
import objectAssign from 'object-assign';
import Api from 'API/index';

const {
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateTime,
  initialResumeShareInfo,
  initialGithubShareInfo
} = createActions(
  'TOGGLE_GITHUB_MODAL',
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_TIME',
  'INITIAL_RESUME_SHARE_INFO',
  'INITIAL_GITHUB_SHARE_INFO',
);

// github data update
const fetchGithubUpdateTime = () => (dispatch, getState) => {
  Api.github.getUpdateTime().then((result) => {
    dispatch(setUpdateTime(result));
  });
};

const refreshGithubDatas = () => (dispatch, getState) => {
  dispatch(toggleSettingLoading(true));
  Api.github.refresh().then((result) => dispatch(setUpdateTime(result)));
};

// github share
const fetchGithubShareInfo = () => (dispatch, getState) => {
  Api.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareInfo(result));
  });
};

const postGithubShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().setting.githubInfo;
  Api.github.toggleShare(!openShare).then((result) => {
    dispatch(initialGithubShareInfo({
      openShare: !openShare
    }));
  });
};

// resume
const fetchResumeShareInfo = () => (dispatch, getState) => {
  Api.resume.getPubResumeStatus().then((result) => {
    dispatch(initialResumeShareInfo(result));
  });
};

const postResumeGithubStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { useGithub } = resumeInfo;
  Api.resume.postPubResumeGithubStatus(!useGithub).then((result) => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      useGithub: !useGithub
    })));
  });
};

const postResumeShareStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { openShare } = resumeInfo;
  Api.resume.postPubResumeShareStatus(!openShare).then((result) => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      openShare: !openShare
    })));
  });
};

const postResumeShareSection = (section, checked) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  Api.resume.postPubResumeGithubSection({ [section]: checked }).then((result) => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      github: objectAssign({}, resumeInfo.github, { [section]: checked })
    })));
  });
};


export default {
  // github
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateTime,
  fetchGithubUpdateTime,
  refreshGithubDatas,
  // github share
  fetchGithubShareInfo,
  initialGithubShareInfo,
  postGithubShareStatus,
  // resume
  initialResumeShareInfo,
  fetchResumeShareInfo,
  postResumeGithubStatus,
  postResumeShareStatus,
  postResumeShareSection,
}
