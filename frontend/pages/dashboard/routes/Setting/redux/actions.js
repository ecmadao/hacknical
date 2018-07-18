import { createActions } from 'redux-actions';
import Push from 'push.js';
import objectAssign from 'UTILS/object-assign';
import API from 'API';
import locales from 'LOCALES';
import HeartBeat from 'UTILS/heartbeat';

const updateMsg = locales('github.message.update');

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
const fetchGithubUpdateStatus = () => (dispatch) => {
  API.github.getUpdateStatus().then((result) => {
    dispatch(setUpdateStatus(result));
  });
};

const refreshGithubDatas = () => (dispatch) => {
  dispatch(toggleSettingLoading(true));
  API.github.update().then(() => {
    const heartBeat = new HeartBeat({
      interval: 5000, // 5s
      callback: () => API.github.getUpdateStatus().then((result) => {
        if (result && result.finished) {
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
  API.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareInfo(result));
  });
};

const postGithubShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().setting.githubInfo;
  API.github.toggleShare(!openShare).then(() => {
    dispatch(initialGithubShareInfo({
      openShare: !openShare
    }));
  });
};

// resume
const fetchResumeShareInfo = () => (dispatch) => {
  API.resume.getResumeInfo().then((result) => {
    dispatch(initialResumeShareInfo(result));
  });
};

const postResumeGithubStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { useGithub, loading } = resumeInfo;
  if (loading) return;

  API.resume.patchResumeInfo({ useGithub: !useGithub }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      useGithub: !useGithub
    })));
  });
};

const postResumeShareStatus = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { openShare, loading } = resumeInfo;
  if (loading) return;

  API.resume.patchResumeInfo({ openShare: !openShare }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      openShare: !openShare
    })));
  });
};

const toggleResumeReminder = enable => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;

  const reminder = objectAssign({}, resumeInfo.reminder, { enable });

  API.resume.patchResumeReminder(reminder).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      reminder
    })));
  });
};

const postResumeReminderChange = (key, value) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const preVal = resumeInfo.reminder[key];
  if (preVal === value) return;

  const reminder = objectAssign({}, resumeInfo.reminder, { [key]: value });

  API.resume.patchResumeReminder({ [key]: value }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      reminder
    })));
  });
};

const toggleResumeSimplifyUrl = () => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const { simplifyUrl, loading } = resumeInfo;
  if (loading) return;

  API.resume.patchResumeInfo({ simplifyUrl: !simplifyUrl }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      simplifyUrl: !simplifyUrl
    })));
  });
};

const postResumeShareSection = (section, checked) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting;
  const github = objectAssign({}, resumeInfo.github, { [section]: checked });

  API.resume.patchResumeInfo({ github }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      github
    })));
  });
};


export default {
  // github
  toggleGithubModal,
  toggleSettingLoading,
  setUpdateStatus,
  fetchGithubUpdateStatus,
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
  toggleResumeReminder,
  postResumeReminderChange,
  toggleResumeSimplifyUrl,
  postResumeShareSection,
};
