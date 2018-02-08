import { getData, patchData, putData } from './base';

const fetchInfo = (url, data = {}) => getData(`/github${url}`, data);
const patchInfo = (url, data = {}) => patchData(`/github${url}`, data);
const putInfo = (url, data = {}) => putData(`/github${url}`, data);

/* get repos & orgs info & user info */
const getAllRepositories = () => fetchInfo('/repositories/all');
const fetchHotmap = () => fetchInfo('/hotmap/initial');
const fetchRepositories = () => fetchInfo('/repositories/initial');
const fetchCommits = () => fetchInfo('/commits/initial');
const fetchOrganizations = () => fetchInfo('/organizations/initial');

const getRepositories = login => fetchInfo(`/${login}/repositories`);
const getContributed = login => fetchInfo(`/${login}/contributed`);
const getCommits = login => fetchInfo(`/${login}/commits`);
const getOrganizations = login => fetchInfo(`/${login}/organizations`);
const getUser = login => fetchInfo(`/${login}/info`);
const getUserHotmap = login => fetchInfo(`/${login}/hotmap`);


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
  // github info
  getUser,
  getCommits,
  getUserHotmap,
  getContributed,
  getRepositories,
  getOrganizations,
  getAllRepositories,
  // for refresh & initial
  refresh,
  fetchHotmap,
  fetchCommits,
  getUpdateTime,
  fetchRepositories,
  fetchOrganizations,
  // share status
  toggleShare,
  getShareRecords,
};
