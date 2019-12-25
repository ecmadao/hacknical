
export const ttl = 600

export const getRecords = qs => ({
  qs,
  url: '/records',
  useCache: true
})

export const getAllRecords = () => ({
  useCache: true,
  url: '/records/all'
})

export const putRecords = data => ({
  url: '/records',
  body: { data },
  method: 'put'
})

export const getLogs = qs => ({
  qs,
  url: '/logs',
  useCache: true
})

export const putLogs = data => ({
  url: '/logs',
  body: { data },
  method: 'put'
})

export const getStat = qs => ({
  qs,
  url: '/stat',
  useCache: true
})

export const putStat = data => ({
  body: { data },
  method: 'put',
  url: '/stat'
})

export const getNotifies = locale => ({
  qs: { locale },
  useCache: true,
  url: '/notify/all'
})

export const getUnreadNotifies = (userId, locale) => ({
  qs: { locale },
  url: `/notify/${userId}`
})

export const markNotifies = (userId, messageIds) => ({
  method: 'put',
  body: { messageIds },
  url: `/notify/${userId}`
})

export const voteNotify = (userId, body) => ({
  body,
  method: 'patch',
  url: `/notify/${userId}`
})
