import { getData } from './base';

const fetchInfo = (url) => getData(`/github${url}`);

const getRepos = () => {
  return fetchInfo('/repos');
};

const getRepository = (reposName) => {
  return fetchInfo(`/${reposName}`);
};

const getReadme = (reposName) => {
  return fetchInfo(`/${reposName}/readme`);
};

const getUser = () => {
  return fetchInfo(`/user`);
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
