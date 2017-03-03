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
  return getData(`/resume/status`);
};

const postPubResumeShareStatus = (enable) => {
  return postData(`/resume/shareStatus`, { enable });
};

const postPubResumeGithubStatus = (enable) => {
  return postData(`/resume/githubStatus`, { enable });
};

const postPubResumeGithubSection = (option) => {
  return postData(`/resume/githubSection`, option);
};

const getShareRecords = () => {
  return getData('/resume/shareRecords');
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
