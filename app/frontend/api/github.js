import { getData } from './base';

const getRepos = () => {
  return getData('/github/repos');
};

const getRepository = (reposName) => {
  return getData(`/github/${reposName}`);
};

const getReadme = (reposName) => {
  return getData(`/github/${reposName}/readme`);
};

export default {
  getRepos,
  getRepository,
  getReadme
}
