import { getData, postData } from './base';

const fetchInfo = (url, data = {}) => getData(`/github${url}`, data);
const postInfo = (url, data = {}) => postData(`/github${url}`, data);

/* get repos & orgs info */
const getRepos = (login) => fetchInfo(`/repos`, { login });
const getOrgs = (login) => fetchInfo(`/orgs`, { login });

/* get user info */
const getBaseUser = () => fetchInfo(`/user`);
const getShareUser = (login) => fetchInfo(`/${login}/user`);
const getUser = (login = '') => {
  if (login) {
    return getShareUser(login);
  }
  return getBaseUser();
};

/* toggle user github share */
const toggleShare = (enable) => postInfo('/share/status', { enable });

/* get github share records */
const getShareRecords = () => fetchInfo(`/share/records`);

const getUpdateTime = () => fetchInfo('/updateTime');

const refresh = () => fetchInfo('/refresh');

const zen = () => fetchInfo('/zen');
const octocat = () => fetchInfo('/octocat');

export default {
  getUser,
  getRepos,
  getOrgs,
  toggleShare,
  getShareRecords,
  getUpdateTime,
  refresh,
  zen,
  octocat
}
