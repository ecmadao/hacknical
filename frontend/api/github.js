import { getData, patchData, putData } from './base';

const fetchInfo = (url, data = {}) => getData(`/github${url}`, data);
const patchInfo = (url, data = {}) => patchData(`/github${url}`, data);
const putInfo = (url, data = {}) => putData(`/github${url}`, data);

/* get repos & orgs info & user info */
const getAllRepositories = () => fetchInfo('/repositories/all');

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

const update = () => putInfo('/update');
const updateStatus = () => fetchInfo('/update/status');

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
  update,
  updateStatus,
  // share status
  toggleShare,
  getShareRecords,
};
