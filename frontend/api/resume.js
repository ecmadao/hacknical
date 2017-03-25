import { postData, getData, putData, patchData } from './base';

const getResume = () => {
  return getData('/resume/edit');
};

const setResume = (resume) => {
  return putData('/resume/edit', { resume })
};

const download = (hash = window.resumeHash) => getData('/resume/download', { hash });

const getPubResume = (hash) => getData(`/resume/pub`, { hash });

const getPubResumeStatus = (hash) => {
  if (hash) {
    return getData(`/resume/${hash}/share`);
  } else {
    return getData(`/resume/share`);
  }
};

const postPubResumeShareStatus = (enable) => {
  return patchData(`/resume/share/status`, { enable });
};

const postPubResumeGithubStatus = (enable) => {
  return patchData(`/resume/share/github`, { enable });
};

const postPubResumeGithubSection = (option) => {
  return patchData(`/resume/github/section`, option);
};

const getShareRecords = () => {
  return getData('/resume/share/records');
};

export default {
  getResume,
  setResume,
  download,
  getPubResume,
  getPubResumeStatus,
  postPubResumeShareStatus,
  postPubResumeGithubStatus,
  postPubResumeGithubSection,
  getShareRecords
}
