import GithubRepos from './schema';

const findRepos = async (githubId, reposId) => {
  return await GithubRepos.findOne({
    githubId,
    reposId
  });
};

const removeRepos = async (githubId, reposId = null) => {
  if (reposId === null) {
    return await GithubRepos.remove({
      githubId
    });
  }
  return await GithubRepos.remove({
    githubId,
    reposId
  });
};

const setRepository = async (githubId, repository) => {
  const {
    id,
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
  	forks_count,
  	forks,
  	watchers,
  	subscribers_count
  } = repository;
  await GithubRepos.create({
    reposId: id,
    githubId,
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
  	forks_count,
  	forks,
  	watchers,
  	subscribers_count
  });
};

const setRepos = async (githubId, repos) => {
  for(let i = 0; i < repos.length; i++) {
    const repository = repos[i];
    const findResult = await findRepos(githubId, repository.id);
    if (!findResult) {
      await setRepository(githubId, repository);
    }
  }
};

const resetRepos = async (githubId, repos) => {
  await removeRepos(githubId);
  for(let i = 0; i < repos.length; i++) {
    const repository = repos[i];
    await setRepository(githubId, repository);
  }
};

export default {
  findRepos,
  removeRepos,
  setRepository,
  setRepos,
  resetRepos
}
