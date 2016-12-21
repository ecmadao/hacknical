import GithubRepos from './schema';

const findRepos = async (userId, reposId) => {
  return await GithubRepos.findOne({
    userId,
    reposId
  });
};

const removeRepos = async (userId, reposId = null) => {
  if (reposId === null) {
    return await GithubRepos.remove({
      userId
    });
  }
  return await GithubRepos.remove({
    userId,
    reposId
  });
};

const setRepository = async (userId, repository) => {
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
  return await GithubRepos.create({
    reposId: id,
    userId,
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

const setRepos = async (userId, repos) => {
  const setResults = [];
  for(let i = 0; i < repos.length; i++) {
    const repository = repos[i];
    const findResult = await findRepos(userId, repository.id);
    if (!findResult) {
      const result = await setRepository(userId, repository);
      setResults.push(result);
    }
  }
  return setResults;
};

const resetRepos = async (userId, repos) => {
  const setResults = [];
  await removeRepos(userId);
  for(let i = 0; i < repos.length; i++) {
    const repository = repos[i];
    const result = await setRepository(userId, repository);
    setResults.push(result);
  }
  return setResults;
};

export default {
  findRepos,
  removeRepos,
  setRepository,
  setRepos,
  resetRepos
}
