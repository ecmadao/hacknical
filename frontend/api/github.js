import { getData, patchData, putData } from './base';

const fetchInfo = (url, data = {}) => getData(`/github${url}`, data);
const patchInfo = (url, data = {}) => patchData(`/github${url}`, data);
const putInfo = (url, data = {}) => putData(`/github${url}`, data);

/* get repos & orgs info */
const getRepos = (login) => fetchInfo(`/repos`, { login });
const getCommits = (login) => fetchInfo(`/commits`, { login });
const getOrgs = (login) => fetchInfo(`/orgs`, { login });
const fetchRepos = () => fetchInfo('/repos/initial');
const fetchCommits = () => fetchInfo('/commits/initial');
const fetchOrgs = () => fetchInfo('/orgs/initial');

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
const toggleShare = (enable) => patchInfo('/share/status', { enable });

/* get github share records */
const getShareRecords = () => fetchInfo(`/share/records`);

const getUpdateTime = () => fetchInfo('/updateTime');

const refresh = () => putInfo('/repos/refresh').then((result) => result && putInfo('/commits/refresh')).then((result) => result && putInfo('/orgs/refresh'));

const zen = () => fetchInfo('/zen');
const octocat = () => fetchInfo('/octocat');

export default {
  getUser,
  getRepos,
  getCommits,
  getOrgs,
  fetchRepos,
  fetchCommits,
  fetchOrgs,
  toggleShare,
  getShareRecords,
  getUpdateTime,
  refresh,
  zen,
  octocat
}
