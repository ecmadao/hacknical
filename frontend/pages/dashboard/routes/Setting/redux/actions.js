import { createActions } from 'redux-actions';
import Push from 'push.js';
import objectAssign from 'UTILS/object-assign';
import Api from 'API';
import locales from 'LOCALES';
import HeartBeat from 'UTILS/heartbeat';

const githubLocales = locales('github');
const updateMsg = githubLocales.message.update;

const {
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateStatus,
  initialResumeShareInfo,
  initialGithubShareInfo
} = createActions(
  'TOGGLE_GITHUB_MODAL',
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_STATUS',
  'INITIAL_RESUME_SHARE_INFO',
  'INITIAL_GITHUB_SHARE_INFO',
);

// github data update
const fetchGithubUpdateTime = () => (dispatch) => {
  Api.github.updateStatus().then((result) => {
    dispatch(setUpdateStatus(result));
  });
};

const refreshGithubDatas = () => (dispatch) => {
  dispatch(toggleSettingLoading(true));
  Api.github.update().then(() => {
    const heartBeat = new HeartBeat({
      interval: 3000, // 3s
      callback: () => Api.github.updateStatus().then((result) => {
        if (result && Number(result.status) === 1) {
          heartBeat.stop();
          dispatch(setUpdateStatus(result));
          Push.create(updateMsg.header, {
            body: updateMsg.body,
            icon: '/vendor/images/hacknical-logo-nofity.png',
            timeout: 3000,
          });
        }
      })
    });
    heartBeat.takeoff();
  });
};

// github share
const fetchGithubShareInfo = () => (dispatch) => {
  Api.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareInfo(result));
  });
};

const postGithubShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().setting.githubInfo;
  Api.github.toggleShare(!openShare).then(() => {
    dispatch(initialGithubShareInfo({
      openShare: !openShare
    }));
  });
};

// resume
const fetchResumeShareInfo = () => (dispatch) => {
  Api.resume.getPubResumeStatus().then((result) => {
    dispatch(initialResumeShareInfo(result));
  });
};

const postResumeGithubStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { useGithub } = resumeInfo;
  Api.resume.postPubResumeGithubStatus(!useGithub).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      useGithub: !useGithub
    })));
  });
};

const postResumeShareStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { openShare } = resumeInfo;
  Api.resume.postPubResumeShareStatus(!openShare).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      openShare: !openShare
    })));
  });
};

const toggleResumeSimplifyUrl = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { simplifyUrl } = resumeInfo;
  Api.resume.togglePubResumeSimplifyUrl(!simplifyUrl).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      simplifyUrl: !simplifyUrl
    })));
  });
};

const postResumeShareSection = (section, checked) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  Api.resume.postPubResumeGithubSection({
    [section]: checked
  }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      github: objectAssign({}, resumeInfo.github, { [section]: checked })
    })));
  });
};


export default {
  // github
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateStatus,
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
  toggleResumeSimplifyUrl,
  postResumeShareSection,
};
