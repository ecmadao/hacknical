
import dateHelper from 'UTILS/date'
import { URLS } from 'UTILS/constant/github'
import { SECONDS_PER_DAY } from 'UTILS/constant'

const getFullDateBySecond = dateHelper.validator.fullDateBySeconds
const getSecondsByDate = dateHelper.seconds.getByDate

const getReposNames = repos =>
  repos.map(repository => repository.name)

const getReposForks = repos =>
  repos.map(repository => repository.forks_count)

const getReposStars = repos =>
  repos.map(repository => repository.stargazers_count)

const getLanguageDistribution = (repos) => {
  const reposLanguages = {}

  for (const repository of repos) {
    const { language } = repository
    reposLanguages[language] = Number.isNaN(reposLanguages[language])
      ? 1
      : reposLanguages[language] + 1
  }
  return reposLanguages
}

const getLanguageSkill = (repos) => {
  const reposLanguages = {}

  for (const repository of repos) {
    const { language, languages, stargazers_count } = repository
    if (!languages) {
      reposLanguages[language] = Number.isNaN(reposLanguages[language])
        ? parseInt(stargazers_count, 10)
        : reposLanguages[language] + parseInt(stargazers_count, 10)
      continue
    }

    for (const lang of Object.keys(languages)) {
      if (reposLanguages[lang]) {
        reposLanguages[lang] += parseInt(stargazers_count, 10)
      } else {
        reposLanguages[lang] = parseInt(stargazers_count, 10)
      }
    }
  }
  return reposLanguages
}

const getLanguageUsed = (repos) => {
  const result = {}

  for (const repository of repos) {
    const { languages } = repository
    if (!languages) continue

    for (const language of Object.keys(languages)) {
      if (result[language]) {
        result[language] += languages[language]
      } else {
        result[language] = languages[language]
      }
    }
  }
  return result
}

const getReposByLanguage = (repos, targetLanguage) => {
  const filtered = repos.filter((repository) => {
    const { languages, language } = repository
    if (!languages) {
      return language === targetLanguage
    }
    return Object.keys(languages).some(key => key === targetLanguage)
  })
  return filtered
}

const getMinDate = (repos) => {
  const createDates = repos.map(
    repository => getSecondsByDate(repository.created_at)
  )
  return getFullDateBySecond(Math.min(...createDates))
}

const getMaxDate = (repos) => {
  const pushDates = repos.map(
    repository => getSecondsByDate(repository.pushed_at)
  )
  return getFullDateBySecond(Math.max(...pushDates))
}

const getDateInterval = (key1, key2) => repos =>
  Math.abs(getSecondsByDate(repos[key1]) - getSecondsByDate(repos[key2]))

const sortByX = ({ key = null, func = null, ascending = false }) =>
  (first, second) => {
    const itemF = key ? first[key] : first
    const itemS = key ? second[key] : second
    const rank = ascending ? 1 : -1
    if (func) {
      return rank * (func(itemF) - func(itemS))
    }
    return rank * (itemF - itemS)
  }

const sortByDate = (repos, key = 'created_at') =>
  repos.sort(sortByX({ key, func: getSecondsByDate })).reverse()

const sortByLanguage = obj =>
  (firstLanguage, secLanguage) =>
    obj[secLanguage] - obj[firstLanguage]

const getReposByX = x => (repos, items) => {
  if (!items) return repos
  return repos.filter(
    repository => items.some(item => item === repository[x])
  )
}

const getReposInfo = (commits, repos) => commits.map((commit) => {
  const { name } = commit
  const targetRepository = repos.find(
    repository => repository.name === name
  )
  if (!targetRepository) return commit

  const {
    language,
    html_url,
    full_name,
    forks_count,
    stargazers_count
  } = targetRepository

  commit.forks_count = forks_count
  commit.language = language
  commit.stargazers_count = stargazers_count
  commit.html_url = html_url
  commit.full_name = full_name
  return commit
})

const getReposCommits = (repos, commits) => repos.map((repository) => {
  const targetRepository = commits.find(
    commit => commit.name === repository.name)
  if (targetRepository) {
    return targetRepository.totalCommits
  }
  return 0
})

const getTotalCount = (repos) => {
  const tmp = repos.reduce((pre, repository) => {
    pre.totalStar += repository.stargazers_count
    pre.totalFork += repository.forks_count
    return pre
  }, {
    totalStar: 0,
    totalFork: 0
  })

  return [tmp.totalStar, tmp.totalFork]
}

const getCreatedRepos = repos =>
  repos.filter(repository => !repository.fork)

const getYearlyRepos = (repos) => {
  const yearAgoSeconds = dateHelper.seconds.beforeYears(1)
  return repos.filter(
    repository => !repository.fork && getSecondsByDate(repository.created_at) > yearAgoSeconds
  )
}

// private
const getMaxObject = (array, callback) => {
  let max = {}

  array.forEach((item, index) => {
    if (index === 0 || (index !== 0 && callback(item, max))) {
      max = item
      max.persistTime =
        getSecondsByDate(item.pushed_at) - getSecondsByDate(item.created_at)
    }
  })
  return max
}

const longestContributeRepos = repos => getMaxObject(repos, (currentRepos, maxRepos) => {
  const currentPresist =
    getSecondsByDate(currentRepos.pushed_at) - getSecondsByDate(currentRepos.created_at)
  return currentPresist > maxRepos.persistTime
})

const formatCommitsTimeline = () => {
  let preCommits = []
  let results = []

  return (commitDatas, dict, minDateSeconds) => {
    if (!commitDatas.length) return []
    if (preCommits.length === commitDatas.length) return results

    results = []
    for (const commitData of commitDatas) {
      const {
        name,
        login,
        commits,
        pushed_at,
        created_at,
        totalCommits
      } = commitData

      if (!totalCommits) continue
      const timeline = []
      let preCommit = null
      const weekSet = new Set()

      for (const commit of commits) {
        const { days, week } = commit
        if (weekSet.has(week)) continue
        weekSet.add(week)

        for (let i = 0; i < days.length; i += 1) {
          const dailyCommit = days[i]
          const daySeconds = week + (i * SECONDS_PER_DAY)
          if (daySeconds < minDateSeconds) continue

          if (!dailyCommit) {
            if (preCommit) {
              timeline.push(preCommit)
              preCommit = null
            }
          } else if (preCommit) {
            preCommit.commits += dailyCommit
            preCommit.to = daySeconds
          } else {
            preCommit = {
              to: daySeconds,
              from: daySeconds,
              commits: dailyCommit
            }
          }
        }
      }
      if (preCommit) timeline.push(preCommit)

      if (timeline.length && timeline[0].from > minDateSeconds) {
        timeline.unshift({
          commits: -1,
          to: timeline[0].from,
          from: minDateSeconds
        })
      }

      const repository = dict[name]
      results.push({
        name,
        login,
        timeline,
        totalCommits,
        ...repository,
        pushed_at: pushed_at || repository.pushed_at,
        created_at: created_at || repository.created_at
      })
    }
    preCommits = commitDatas
    return results
  }
}

export default {
  baseUrl: URLS.GITHUB,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getLanguageUsed,
  getReposByLanguage,
  getMinDate,
  getMaxDate,
  getDateInterval,
  /* sort */
  sortByX,
  sortByDate,
  sortByLanguage,
  /* ================== */
  getReposByX,
  getReposInfo,
  getReposCommits,
  getTotalCount,
  getYearlyRepos,
  getCreatedRepos,
  longestContributeRepos,
  /* ================== */
  formatCommitsTimeline
}
