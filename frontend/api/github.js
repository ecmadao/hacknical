import { getData, postData } from './base';

const fetchInfo = (url) => getData(`/github${url}`);
const postInfo = (url, data) => postData(`/github${url}`, data);

/* get user repos info */
const getBaseRepos = () => fetchInfo(`/repos`);
const getSharedRepos = (login) => fetchInfo(`/${login}/shareInfo`);
const getRepos = (login) => {
  if (login) {
    return getSharedRepos(login)
  }
  return getBaseRepos();
};

const getRepository = (reposName) => fetchInfo(`/${reposName}`);

const getReadme = (reposName) => fetchInfo(`/${reposName}/readme`);

/* get user info */
const getBaseUser = () => fetchInfo(`/user`);;
const getShareUser = (login) => fetchInfo(`/${login}/share`);
const getUser = (login = '') => {
  if (login) {
    return getShareUser(login);
  }
  return getBaseUser();
};

const getCommits = () => fetchInfo(`/repos/commits`);

const getShareInfo = (login) => fetchInfo(`/${login}/shareInfo`);

/* toggle user github share */
const toggleShare = (enable) => postInfo('/user/toggleShare', { enable });

/* get github share datas */
const getShareData = () => fetchInfo(`/shareData`);

const getUpdateTime = () => fetchInfo('/updateTime');

const refresh = () => fetchInfo('/refresh');

const zen = () => fetchInfo('/zen');

const octocat = () => fetchInfo('/octocat');

export default {
  getUser,
  getRepos,
  getRepository,
  getReadme,
  getCommits,
  getShareInfo,
  toggleShare,
  getShareData,
  getUpdateTime,
  refresh,
  zen,
  octocat
}
