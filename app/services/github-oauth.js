import config from 'config'

export const CALLBACK_PATH = '/api/user/login/github/callback'

export const getSettings = () => {
  const oauth = config.get('github.oauth')
  const appUrl = config.get('url') || (process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : '')
  return {
    clientId: oauth.clientId || process.env.GITHUB_CLIENT_ID,
    clientSecret: oauth.clientSecret || process.env.GITHUB_CLIENT_SECRET,
    redirectUri: oauth.redirectUri || (appUrl ? new URL(CALLBACK_PATH, appUrl).href : ''),
    baseUrl: oauth.baseUrl || 'https://github.com',
    apiUrl: config.get('github.apiUrl')
  }
}

export const isConfigured = () => {
  const { clientId, clientSecret, redirectUri } = getSettings()
  if (!clientId || !clientSecret || !redirectUri) return false
  try {
    const uri = new URL(redirectUri)
    return process.env.NODE_ENV === 'production' ? uri.protocol === 'https:' : /^https?:$/.test(uri.protocol)
  } catch (error) {
    return false
  }
}

export const authorizationUrl = state => {
  const { clientId, redirectUri, baseUrl } = getSettings()
  const url = new URL('/login/oauth/authorize', baseUrl)
  url.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state
  }).toString()
  return url.href
}

const requestJson = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    redirect: 'error',
    signal: AbortSignal.timeout(15000)
  })
  if (!response.ok) throw new Error(`GitHub OAuth request failed (${response.status})`)
  return response.json()
}

export const exchangeCode = async code => {
  if (!isConfigured() || typeof code !== 'string' || !code || code.startsWith('local:')) {
    throw new Error('GitHub OAuth is not configured or authorization code is invalid')
  }
  const { clientId, clientSecret, redirectUri, baseUrl } = getSettings()
  const result = await requestJson(new URL('/login/oauth/access_token', baseUrl), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code
    })
  })
  if (result.error || typeof result.access_token !== 'string' || !result.access_token) {
    throw new Error('GitHub rejected the authorization code')
  }
  const lifetime = Number(result.expires_in)
  if (result.expires_in !== undefined && (!Number.isFinite(lifetime) || lifetime <= 0)) {
    throw new Error('GitHub returned an invalid token lifetime')
  }
  return {
    accessToken: result.access_token,
    expiresAt: result.expires_in === undefined ? null
      : Date.now() + lifetime * 1000 - Math.min(60000, lifetime * 100)
  }
}

export const getToken = async code => (await exchangeCode(code)).accessToken

export const getLogin = async token => {
  if (!token || typeof token !== 'string' || token.startsWith('local:')) {
    throw new Error('Invalid GitHub access token')
  }
  const { apiUrl } = getSettings()
  const profile = await requestJson(new URL('/user', apiUrl), {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'hacknical',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  if (!profile.id || typeof profile.login !== 'string' || !/^[a-z\d-]+$/i.test(profile.login)) {
    throw new Error('GitHub returned an invalid profile')
  }
  return profile
}
