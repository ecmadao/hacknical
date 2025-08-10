
import API from './base'

const logout = () => API.get('/user/logout')

const getUserInfo = login => API.get('/user/info', { login })
const patchUserInfo = info => API.patch('/user/info', { info })
const getGitHubSections = login => API.get('/user/github', { login })

const initialed = () => API.patch('/user/initialed')

const markNotifies = messageIds => API.patch('/user/notifies', { messageIds })
const getNotifies = () => API.get('/user/notifies')
const voteNotify = (messageId, data) => API.patch(`/user/notifies/${messageId}`, data)

// Email authentication APIs
const registerByEmail = data => API.post('/user/register', data)
const loginByEmail = data => API.post('/user/login/email', data)
const verifyEmail = token => API.get(`/user/verify-email?token=${token}`)
const requestPasswordReset = data => API.post('/user/reset-password', data)
const confirmPasswordReset = data => API.post('/user/confirm-reset-password', data)

export default {
  logout,
  initialed,
  getUserInfo,
  patchUserInfo,
  getGitHubSections,
  // notify
  markNotifies,
  getNotifies,
  voteNotify,
  // email auth
  registerByEmail,
  loginByEmail,
  verifyEmail,
  requestPasswordReset,
  confirmPasswordReset
}
