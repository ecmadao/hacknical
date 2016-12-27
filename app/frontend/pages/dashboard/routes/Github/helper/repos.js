import { sortRepos } from 'UTILS/helper';

export const getReposNames = (repos) => {
  return repos.map(repository => repository.name);
};

export const getReposForks = (repos) => {
  return repos.map(repository => repository['forks_count']);
};

export const getReposStars = (repos) => {
  return repos.map(repository => repository['stargazers_count']);
};

export const getLanguageDistribution = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? 1 : reposLanguages[language] + 1;
  });
  return reposLanguages;
};

export const getLanguageSkill = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language, stargazers_count } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? parseInt(stargazers_count) : reposLanguages[language] + parseInt(stargazers_count);
  });
  return reposLanguages;
};

export const getReposLanguages = (repos) => {
  const languages = [];
  repos.forEach((repository) => {
    const { language } = repository;
    if (!languages.some(item => item === language)) {
      if (language) {
        languages.push(language);
      }
    }
  });
  return languages;
};

export const getReposByLanguage = (repos, language) => {
  return repos.filter(repository => repository.language === language).sort(sortRepos('stargazers_count'));
};
