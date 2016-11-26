const sortRepos = (firstRepos, secRepos) => {
  return parseInt(secRepos.stargazersCount) - parseInt(firstRepos.stargazersCount)
}

export const getFlatReposInfos = (repos) => {
  return repos.map((repository) => {
    const {
      name,
      html_url,
      fork,
      stargazers_count,
      watchers_count,
      forks_count,
      language,
      created_at
    } = repository;
    return {
      name,
      fork,
      language,
      createdAt: created_at,
      htmlUrl: html_url,
      stargazersCount: stargazers_count,
      watchersCount: watchers_count,
      forksCount: forks_count
    }
  }).sort(sortRepos).slice(0, 10);
}

export const getReposNames = (repos) => {
  return repos.map(repository => repository.name);
};

export const getReposForks = (repos) => {
  return repos.map(repository => repository.forksCount);
};

export const getReposStars = (repos) => {
  return repos.map(repository => repository.stargazersCount);
};
