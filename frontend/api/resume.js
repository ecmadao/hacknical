import { postData, getData } from './base';

const getResume = () => {
  return getData('/resume');
};

const setResume = (resume) => {
  return postData('/resume', { resume })
};

const getPubResume = (hash) => {
  return getData(`/resume/${hash}/pub`);
};

export default {
  getResume,
  setResume,
  getPubResume
}
