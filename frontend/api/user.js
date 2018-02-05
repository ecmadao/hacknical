import { getData, patchData } from './base';

const logout = () => getData('/user/logout');

const getSections = loginData =>
  getData('/user/githubSections', { login: loginData });

const setSections = sections => patchData('/user/githubSections', sections);

const initialed = () => patchData('/user/initialed');

const getPinnedRepos = () => getData('/user/repos/pinned');
const setPinnedRepos = pinnedRepos =>
  patchData('/user/repos/pinned', { pinnedRepos });

export default {
  logout,
  getSections,
  setSections,
  initialed,
  getPinnedRepos,
  setPinnedRepos
};
