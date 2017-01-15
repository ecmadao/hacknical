import { getData, postData } from './base';

const fetchInfo = (url) => getData(`/github${url}`);
const postInfo = (url, data) => postData(`/github${url}`, data);

/* get user repos info */
const getBaseRepos = () => {
  return fetchInfo(`/repos`);
};
const getSharedRepos = (login) => {
  return fetchInfo(`/${login}/shareInfo`);
}
const getRepos = (login) => {
  if (login) {
    return getSharedRepos(login)
  }
  return getBaseRepos();
};

const getRepository = (reposName) => {
  return fetchInfo(`/${reposName}`);
};

const getReadme = (reposName) => {
  return fetchInfo(`/${reposName}/readme`);
};

/* get user info */
const getBaseUser = () => {
  return fetchInfo(`/user`);
};
const getShareUser = (login) => {
  return fetchInfo(`/${login}/share`);
};
const getUser = (login = '') => {
  if (login) {
    return getShareUser(login);
  }
  return getBaseUser();
};

const getCommits = () => {
  return fetchInfo(`/repos/commits`);
};

const getShareInfo = (login) => {
  return fetchInfo(`/${login}/shareInfo`);
};

/* toggle user github share */
const toggleShare = (enable) => {
  return postInfo('/user/toggleShare', { enable });
};

/* get github share datas */
const getShareData = () => {
  return fetchInfo(`/shareData`);
};

export default {
  getUser,
  getRepos,
  getRepository,
  getReadme,
  getCommits,
  getShareInfo,
  toggleShare,
  getShareData
}
