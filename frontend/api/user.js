
import API from './base'

const logout = () => API.get('/user/logout')

const getUserInfo = login => API.get('/user/info', { login })
const patchUserInfo = info => API.patch('/user/info', { info })
const getGitHubSections = login => API.get('/user/github', { login })

const initialed = () => API.patch('/user/initialed')

const markNotifies = messageIds => API.patch('/user/notifies', { messageIds })
const getNotifies = () => API.get('/user/notifies')
const voteNotify = (messageId, data) => API.patch(`/user/notifies/${messageId}`, data)

export default {
  logout,
  initialed,
  getUserInfo,
  patchUserInfo,
  getGitHubSections,
  // notify
  markNotifies,
  getNotifies,
  voteNotify
}
