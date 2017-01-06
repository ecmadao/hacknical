import { getData } from './base';

const fetchInfo = (url) => getData(`/github${url}`);

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
}

export default {
  getUser,
  getRepos,
  getRepository,
  getReadme,
  getCommits,
  getShareInfo
}
