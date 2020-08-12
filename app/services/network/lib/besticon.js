
export const ttl = 60000

/* =========================== api funcs =========================== */

export const getIcon = url => ({
  qs: { url },
  url: '/allicons.json',
  useCache: false
})
