
import Orgs from './schema';

/**
 * private
 */
const getOrgInfo = (orgInfo) => {
  const {
    login,
    name,
    avatar_url,
    company,
    blog,
    location,
    email,
    description,
    created_at,
    updated_at,
    public_repos,
    public_gists,
    followers,
    following,
    repos,
    html_url,
    type
  } = orgInfo;
  return {
    login,
    name,
    avatar_url,
    company,
    blog,
    location,
    email,
    description,
    created_at,
    updated_at,
    public_repos,
    public_gists,
    followers,
    following,
    html_url,
    type,
    repos: repos || []
  };
};

const getReposInfo = (repos) => {
  const {
    full_name,
    name,
    html_url,
    description,
    fork,
    created_at,
    updated_at,
    pushed_at,
    homepage,
    size,
    stargazers_count,
    watchers_count,
    language,
    languages,
    contributors,
    forks_count,
    forks,
    watchers
  } = repos;
  return {
    full_name,
    name,
    html_url,
    description,
    fork,
    created_at,
    updated_at,
    pushed_at,
    homepage,
    size,
    stargazers_count,
    watchers_count,
    language,
    languages,
    contributors,
    forks_count,
    forks,
    watchers
  }
};

/* === API === */

const findOrgByLogin = async (login) => {
  return await Orgs.findOne({ login });
};

const findOrgsByLogin = async (logins) => {
  return await Orgs.find({
    login: {
      "$in": logins
    }
  });
};

const updateOrg = async (login) => {

};

const updateOrgRepos = async (login, repos) => {
  const findOrg = await findOrgByLogin(login);
  if (!findOrg) {
    return Promise.resolve({
      success: false
    });
  }
  const newRepos = repos.map(repository => getReposInfo(repository));
  findOrg.repos = [...newRepos];
  await findOrg.save();
  return Promise.resolve({
    success: true,
    result: findOrg
  });
};

const createOrg = async (orgInfo) => {
  const newOrgInfo = getOrgInfo(orgInfo);
  const { login, repos } = newOrgInfo;
  const newRepos = repos.map(repository => getReposInfo(repository));
  newOrgInfo.repos = newRepos;

  let findOrg = await findOrgByLogin(login);
  if (findOrg) {
    findOrg = Object.assign({}, findOrg, newOrgInfo);
    await findOrg.save();
    return Promise.resolve({
      success: true,
      result: findOrg
    });
  }
  const newOrg = await Orgs.create(newOrgInfo);
  return Promise.resolve({
    success: true,
    result: newOrg
  });
};

export default {
  find: findOrgByLogin,
  findMany: findOrgsByLogin,
  create: createOrg,
  update: updateOrg,
  updateRepos: updateOrgRepos
}
