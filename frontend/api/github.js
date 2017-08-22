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
const getAllRepos = () => fetchInfo('/repositories/all');
const fetchRepos = () => fetchInfo('/repositories/initial');
const fetchCommits = () => fetchInfo('/commits/initial');
const fetchOrgs = () => fetchInfo('/organizations/initial');
const getRepos = login => fetchInfo(routerAdapter('repositories', login));
const getContributed = login =>
  fetchInfo(routerAdapter('contributed', login));
const getCommits = login => fetchInfo(routerAdapter('commits', login));
const getOrgs = login => fetchInfo(routerAdapter('organizations', login));
const getUser = login => fetchInfo(routerAdapter('user', login));
const getUserScientific = login => fetchInfo(routerAdapter('scientific', login));
const getUserPredictions = login => fetchInfo(routerAdapter('predictions', login));


/* toggle user github share */
const toggleShare = enable => patchInfo('/share/status', { enable });

/* get github share records */
const getShareRecords = () => fetchInfo('/share/records');

const getUpdateTime = () => fetchInfo('/updateTime');

const refresh = () => putInfo('/repositories/refresh')
  .then(result => result && putInfo('/commits/refresh'))
  .then(result => result && putInfo('/organizations/refresh'));

const zen = () => fetchInfo('/zen');
const octocat = () => fetchInfo('/octocat');

export default {
  zen,
  octocat,
  refresh,
  getUser,
  getRepos,
  getContributed,
  getAllRepos,
  getCommits,
  getOrgs,
  fetchRepos,
  fetchCommits,
  fetchOrgs,
  toggleShare,
  getShareRecords,
  getUpdateTime,
  getUserScientific,
  getUserPredictions,
};
