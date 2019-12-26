
import API from './base'

/* get repos & orgs info & user info */
const getAllRepositories = () => API.get('/github/repositories/all')

const getRepositories = login => API.get(`/github/${login}/repositories`)
const getContributed = login => API.get(`/github/${login}/contributed`)
const getCommits = login => API.get(`/github/${login}/commits`)
const getLanguages = login => API.get(`/github/${login}/languages`)
const getOrganizations = login => API.get(`/github/${login}/organizations`)
const getUser = login => API.get(`/github/${login}/info`)
const getUserHotmap = login => API.get(`/github/${login}/hotmap`)

/* get github share records */
const getShareRecords = () => API.get('/github/records')
const getViewLogs = qs => API.get('/github/logs', qs)

const update = () => API.put('/github/update')
const getUpdateStatus = () => API.get('/github/update')

const zen = () => API.get('/github/zen')
const octocat = () => API.get('/github/octocat')

export default {
  zen,
  octocat,
  // github info
  getUser,
  getCommits,
  getLanguages,
  getUserHotmap,
  getContributed,
  getRepositories,
  getOrganizations,
  getAllRepositories,
  // for refresh & initial
  update,
  getUpdateStatus,
  // share status
  getShareRecords,
  getViewLogs
}
