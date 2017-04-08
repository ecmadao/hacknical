import { getData, patchData, putData } from './base';

const fetchInfo = (url, data = {}) => getData(`/github${url}`, data);
const patchInfo = (url, data = {}) => patchData(`/github${url}`, data);
const putInfo = (url, data = {}) => putData(`/github${url}`, data);
const routerAdapter = (router, login = null) => {
  if (login) {
    return `/${login}/${router}`;
  }
  return `/${router}`;
};

/* get repos & orgs info & user info */
const getAllRepos = () => fetchInfo(`/repos/all`);
const fetchRepos = () => fetchInfo('/repos/initial');
const fetchCommits = () => fetchInfo('/commits/initial');
const fetchOrgs = () => fetchInfo('/orgs/initial');
const getRepos = (login = null) => fetchInfo(routerAdapter('repos', login));
const getCommits = (login = null) => fetchInfo(routerAdapter('commits', login));
const getOrgs = (login = null) => fetchInfo(routerAdapter('orgs', login));
const getUser = (login = null) => fetchInfo(routerAdapter('user', login));


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
  getAllRepos,
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
