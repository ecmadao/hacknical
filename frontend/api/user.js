import { postData, getData, patchData } from './base';

const login = (email, pwd) => postData('/user/login', { email, pwd });

const signup = (email, pwd) => postData('/user/signup', { email, pwd });

const logout = () => getData('/user/logout');

const getSections = (login) => getData('/user/github_sections', { login });

const setSections = (sections) => postData('/user/github_sections', sections);

const initialed = () => patchData('/user/initialed');

const getPinnedRepos = () => getData('/user/repos/pinned');
const setPinnedRepos = (pinnedRepos) => postData('/user/repos/pinned', { pinnedRepos });

export default {
  login,
  signup,
  logout,
  getSections,
  setSections,
  initialed,
  getPinnedRepos,
  setPinnedRepos
}
