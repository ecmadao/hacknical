import { postData, getData } from './base';

const getResume = () => {
  return getData('/user/resume');
};

const setResume = (resume) => {
  return postData('/user/resume', { resume })
};

export default {
  getResume,
  setResume
}
