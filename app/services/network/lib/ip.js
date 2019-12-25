
export const ttl = 100000

export const getInfo = ip => ({
  qs: {
    ip,
    json: true
  },
  url: '',
  headers: {
    'Accept-Encoding': 'gzip',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
  },
  useCache: false,
  gzip: true,
  json: false,
  encoding: null
})
