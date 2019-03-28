
export const ttl = 60

/* =========================== api funcs =========================== */

export const getZen = token => ({
  qs: { token },
  url: '/github/zen',
  useCache: true
})

export const getOctocat = () => ({
  url: '/github/octocat',
  useCache: true
})

export const getVerify = () => ({
  url: '/github/verify'
})

export const getToken = code => ({
  qs: { code },
  url: '/github/token'
})

export const getLogin = token => ({
  qs: { token },
  url: '/github/login'
})

export const getUser = (login, token) => ({
  useCache: true,
  qs: { token },
  url: `/github/${login}`
})

export const getUserRepositories = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/github/${login}/repositories`
})

export const getUserContributed = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/github/${login}/contributed`
})

export const getUserCommits = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/github/${login}/commits`
})

export const getUserLanguages = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/github/${login}/languages`
})

export const getUserOrganizations = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/github/${login}/organizations`
})

export const getUpdateStatus = login => ({
  url: `/github/${login}/update`
})

export const updateUserData = (login, token) => ({
  method: 'put',
  body: { token },
  timeouts: [null],
  url: `/github/${login}/update`
})

export const updateUser = (login, data) => ({
  method: 'patch',
  body: { data },
  timeouts: [null],
  url: `/github/${login}`
})

export const getHotmap = (login, locale) => ({
  qs: { locale },
  useCache: true,
  url: `/github/${login}/hotmap`
})

export const getUserStatistic = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/scientific/${login}/statistic`
})

export const getUserPredictions = (login, token) => ({
  qs: { token },
  useCache: true,
  url: `/scientific/${login}/predictions`
})

export const removePrediction = (login, fullName) => ({
  method: 'delete',
  body: { fullName },
  url: `/scientific/${login}/predictions`
})

export const putPredictionsFeedback = (login, fullName, liked) => ({
  method: 'put',
  body: {
    liked,
    fullName,
  },
  url: `/scientific/${login}/predictions`
})
