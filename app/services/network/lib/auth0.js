import config from 'config'

const ttl = 604800

const auth0Credential = (function() {
  const auth0Config = config.get("services.auth0")
  const auth = auth0Config.auth
  const domain = auth0Config.url || process.env.AUTH0_DOMAIN
  return {
    clientId: auth.clientId || process.env.AUTH0_CLIENT_ID,
    clientSecret: auth.clientSecret || process.env.AUTH0_CLIENT_SECRET,
    redirectUri: auth.redirectUri || process.env.AUTH0_REDIRECT_URI,
    audience: `${domain}/api/v2/`,
    domain,
  }
})()

const getAccessToken = (code) => ({
  url: '/oauth/token',
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    grant_type: 'authorization_code',
    client_id: auth0Credential.clientId,
    client_secret: auth0Credential.clientSecret,
    code,
    redirect_uri: auth0Credential.redirectUri
  }
})

const getUserInfo = (accessToken) => ({
  url: '/userinfo',
  method: 'get',
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
})

const getManagementToken = () => ({
  url: '/oauth/token',
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    grant_type: 'client_credentials',
    client_id: auth0Credential.clientId,
    client_secret: auth0Credential.clientSecret,
    audience: auth0Credential.audience
  },
  useCache: true,
  ttl: 86400
})

const getUserById = (userId, managementToken) => ({
  url: `/api/v2/users/${userId}`,
  method: 'get',
  headers: {
    Authorization: `Bearer ${managementToken}`
  }
})

const updateUser = (userId, updates, managementToken) => ({
  url: `/api/v2/users/${userId}`,
  method: 'patch',
  headers: {
    Authorization: `Bearer ${managementToken}`,
    'Content-Type': 'application/json'
  },
  body: updates
})

module.exports = {
  ttl,
  auth0Credential,
  getAccessToken,
  getUserInfo,
  getManagementToken,
  getUserById,
  updateUser
}