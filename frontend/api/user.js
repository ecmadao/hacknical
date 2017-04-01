import { postData, getData, patchData } from './base';

const login = (email, pwd) => postData('/user/login', { email, pwd });

const signup = (email, pwd) => postData('/user/signup', { email, pwd });

const logout = () => getData('/user/logout');

const getSections = (login) => getData('/user/githubSections');

const setSections = (sections) => postData('/user/githubSections', sections);

const initialed = () => patchData('/user/initialed');

export default {
  login,
  signup,
  logout,
  getSections,
  setSections,
  initialed
}
