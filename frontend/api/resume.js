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

const postPubResumeStatus = (enable) => {
  return postData(`/resume/status`, { enable });
};

export default {
  getResume,
  setResume,
  getPubResume,
  getPubResumeStatus,
  postPubResumeStatus
}
