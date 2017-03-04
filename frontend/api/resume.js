import { postData, getData } from './base';

const getResume = () => {
  return getData('/resume/edit');
};

const setResume = (resume) => {
  return postData('/resume/edit', { resume })
};

const getPubResume = (hash) => {
  return getData(`/resume/${hash}/pub`);
};

const getPubResumeStatus = () => {
  return getData(`/resume/share`);
};

const postPubResumeShareStatus = (enable) => {
  return postData(`/resume/share/status`, { enable });
};

const postPubResumeGithubStatus = (enable) => {
  return postData(`/resume/share/github`, { enable });
};

const postPubResumeGithubSection = (option) => {
  return postData(`/resume/github/section`, option);
};

const getShareRecords = () => {
  return getData('/resume/share/records');
};

export default {
  getResume,
  setResume,
  getPubResume,
  getPubResumeStatus,
  postPubResumeShareStatus,
  postPubResumeGithubStatus,
  postPubResumeGithubSection,
  getShareRecords
}
