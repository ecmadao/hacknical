import { getData, patchData } from './base';

const logout = () => getData('/user/logout');

const getUserInfo = login => getData('/user/info', { login });
const setUserInfo = info => patchData('/user/info', { info });

const initialed = () => patchData('/user/initialed');

export default {
  logout,
  initialed,
  getUserInfo,
  setUserInfo,
};
