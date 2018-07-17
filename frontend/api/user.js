import { getData, patchData, putData } from './base';

const logout = () => getData('/user/logout');

const getUserInfo = login => getData('/user/info', { login });
const setUserInfo = info => patchData('/user/info', { info });

const initialed = () => patchData('/user/initialed');

const getNotifies = () => getData('/user/notifies/all');
const markNotifies = ids => putData('/user/notifies/read', { ids });
const getUnreadNotifies = () => getData('/user/notifies/unread');

export default {
  logout,
  initialed,
  getUserInfo,
  setUserInfo,
  getNotifies,
  markNotifies,
  getUnreadNotifies
};
