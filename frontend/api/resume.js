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

export default {
  getResume,
  setResume,
  getPubResume
}
