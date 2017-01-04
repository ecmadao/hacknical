import { sortRepos } from './helper';
import {
  getSecondsByDate,
  getValidateFullDate,
  getSecondsBeforeYears
} from './date';

const baseUrl = 'https://github.com';

const combineReposCommits = (reposCommits) => {
  const result = {
    commits: [],
    total: 0,
    dailyCommits: [
      // from sunday to monday
    ]
  };
  reposCommits.forEach((repository, repositoryIndex) => {
    repository.commits.forEach((commit, index) => {
      const { total, days, week } = commit;
      result.total += total;

      const targetCommit = result.commits[index];
      if (!targetCommit) {
        result.commits.push({
          total,
          days,
          week
        });
        days.forEach((day, i) => {
          result.dailyCommits[i] = day;
        });
        return;
      }

      targetCommit.total += total;
      days.forEach((day, i) => {
        targetCommit.days[i] += day;
        result.dailyCommits[i] += day;
      });
    });
  });
  return result;
};

const getReposNames = (repos) => {
  return repos.map(repository => repository.name);
};

const getReposForks = (repos) => {
  return repos.map(repository => repository['forks_count']);
};

const getReposStars = (repos) => {
  return repos.map(repository => repository['stargazers_count']);
};

const getLanguageDistribution = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? 1 : reposLanguages[language] + 1;
  });
  return reposLanguages;
};

const getLanguageSkill = (repos) => {
  const reposLanguages = {};
  repos.forEach((repository) => {
    const { language, stargazers_count } = repository;
    reposLanguages[language] = isNaN(reposLanguages[language]) ? parseInt(stargazers_count) : reposLanguages[language] + parseInt(stargazers_count);
  });
  return reposLanguages;
};

const getLanguageUsed = (repos) => {
  const result = {};
  repos.forEach(repository => {
    const { languages } = repository;
    if (!languages) { return }
    Object.keys(languages).forEach(language => {
      if (result[language]) {
        result[language] += languages[language];
      } else {
        result[language] = languages[language];
      }
    });
  });
  return result;
};

const getReposLanguages = (repos) => {
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

const getReposByLanguage = (repos, language) => {
  return repos.filter(repository => repository.language === language).sort(sortRepos('stargazers_count'));
};

const getMinDate = (repos) => {
  const createDates = repos.map(repository => new Date(repository['created_at']));
  return getValidateFullDate(Math.min(...createDates));
};

const getMaxDate = (repos) => {
  const pushDates = repos.map(repository => new Date(repository['pushed_at']));
  return getValidateFullDate(Math.max(...pushDates));
};

const sortByDate = (repos) => {
  return repos.sort(sortRepos('created_at'));
};

const getReposByIds = (repos, ids) => {
  return repos.filter(repository => ids.some(id => parseInt(id) === parseInt(repository.reposId)));
};

const getReposInfo = (commits, repos) => {
  return commits.map((commit, index) => {
    const { reposId } = commit;
    const targetRepos = repos.filter(repository => repository.reposId === reposId);
    if (!targetRepos.length) {
      return commit;
    }
    const {
      forks_count,
      language,
      stargazers_count,
      html_url,
      full_name
    } = targetRepos[0];
    commit['forks_count'] = forks_count;
    commit['language'] = language;
    commit['stargazers_count'] = stargazers_count;
    commit['html_url'] = html_url;
    commit['full_name'] = full_name;
    return commit;
  });
};

const getReposCommits = (repos, commits) => {
  return repos.map((repository) => {
    const targetRepos = commits.filter(commit => commit.reposId === repository.reposId);
    if (targetRepos.length) {
      return targetRepos[0].totalCommits;
    }
    return 0;
  });
};

const getTotalCount = (repos) => {
  let totalStar = 0;
  let totalFork = 0;
  repos.forEach((repository) => {
    totalStar += repository['stargazers_count'];
    totalFork += repository['forks_count'];
  });
  return [totalStar, totalFork]
};

const getYearlyRepos = (repos) => {
  const yearAgoSeconds = getSecondsBeforeYears(1);
  return repos.filter((repository) => {
    return !repository.fork && getSecondsByDate(repository['created_at']) > yearAgoSeconds
  });
};

// private
const getMaxObject = (array, callback) => {
  let max = {};
  array.forEach((item, index) => {
    if (index === 0 || (index !== 0 && callback(item, max))) {
      max = item;
      max['persistTime'] = getSecondsByDate(item['pushed_at']) - getSecondsByDate(item['created_at']);
    }
  });
  return max;
};

const longestContributeRepos = (repos) => {
  return getMaxObject(repos, (currentRepos, maxRepos) => {
    const currentPresist = getSecondsByDate(currentRepos['pushed_at']) - getSecondsByDate(currentRepos['created_at']);
    return currentPresist > maxRepos.persistTime;
  });
};

export default {
  baseUrl,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getLanguageUsed,
  getReposLanguages,
  getReposByLanguage,
  combineReposCommits,
  getMinDate,
  getMaxDate,
  sortByDate,
  getReposByIds,
  getReposInfo,
  getReposCommits,
  getTotalCount,
  getYearlyRepos,
  longestContributeRepos
}
