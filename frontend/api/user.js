
import API from './base'

const logout = () => API.get('/user/logout')

const getUserInfo = login => API.get('/user/info', { login })
const setUserInfo = info => API.patch('/user/info', { info })

const initialed = () => API.patch('/user/initialed')

const getNotifies = () => API.get('/user/notifies/all')
const markNotifies = ids => API.put('/user/notifies/read', { ids })
const getUnreadNotifies = () => API.get('/user/notifies/unread')

const upvote = messageId => API.patch(`/user/notifies/upvote/${messageId}`)
const downvote = messageId => API.patch(`/user/notifies/downvote/${messageId}`)

export default {
  logout,
  initialed,
  getUserInfo,
  setUserInfo,
  getNotifies,
  markNotifies,
  getUnreadNotifies,
  // vote
  upvote,
  downvote
}
