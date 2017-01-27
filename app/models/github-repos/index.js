import GithubRepos from './schema';

const findRepository = async (userId, reposId) => {
  return await GithubRepos.findOne({
    userId,
    reposId
  });
};

const findRepos = async (userId) => {
  return await GithubRepos.find({ userId });
};

const clearRepos = async (userId) => {
  return await GithubRepos.remove({
    userId
  });
};

const removeRepos = async (userId, reposId = null) => {
  if (reposId === null) {
    return await clearRepos(userId);
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
    languages,
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
    languages: languages || {},
  	forks_count,
  	forks,
  	watchers,
  	subscribers_count
  });
};

const setRepos = async (userId, repos) => {
  const setResults = [];
  await removeRepos(userId);
  for(let i = 0; i < repos.length; i++) {
    const repository = repos[i];
    const findResult = await findRepository(userId, repository.id);
    if (!findResult) {
      const result = await setRepository(userId, repository);
      setResults.push(result);
    } else {
      setResults.push(findResult);
    }
  }
  return setResults;
};

const getRepos = async (userId) => {
  return await GithubRepos.find({
    userId
  });
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
  removeRepos,
  setRepository,
  setRepos,
  getRepos,
  resetRepos
}
