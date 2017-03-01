import { postData, getData } from './base';

const login = (email, pwd) => {
  return postData('/user/login', { email, pwd });
};

const signup = (email, pwd) => {
  return postData('/user/signup', { email, pwd });
};

const logout = () => {
  return getData('/user/logout');
};

const getSections = (login) => {
  return getData('/user/githubSections');
};

const setSections = (sections) => {
  return postData('/user/githubSections', sections);
};

export default {
  login,
  signup,
  logout,
  getSections,
  setSections
}
