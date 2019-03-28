
import API from './base'

const logout = () => API.get('/user/logout')

const getUserInfo = login => API.get('/user/info', { login })
const patchUserInfo = info => API.patch('/user/info', { info })

const initialed = () => API.patch('/user/initialed')

const markNotifies = ids => API.patch('/user/notifies', { ids })
const getNotifies = () => API.get('/user/notifies')

const upvote = messageId => API.patch(`/user/notifies/upvote/${messageId}`)
const downvote = messageId => API.patch(`/user/notifies/downvote/${messageId}`)

export default {
  logout,
  initialed,
  getUserInfo,
  patchUserInfo,
  // notify
  markNotifies,
  getNotifies,
  upvote,
  downvote
}
