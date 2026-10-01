const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

let provider, providerUrl, app, origin, temporary, database, output = ''
const exchanges = []
let profileFailure = false

async function unusedPort() {
  const server = http.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const port = server.address().port
  await new Promise(resolve => server.close(resolve))
  return port
}

async function launch(configured = true) {
  const port = await unusedPort()
  origin = `http://127.0.0.1:${port}`
  const env = {
    ...process.env, NODE_ENV: 'production', PORT: String(port),
    APP_URL: 'https://hack.r2049.cn', APP_KEY: 'a'.repeat(64),
    SQLITE_PATH: database, LOG_LEVEL: 'ERROR',
    GITHUB_API_URL: providerUrl,
    GITHUB_CLIENT_ID: '', GITHUB_CLIENT_SECRET: '',
    GITHUB_OAUTH_CLIENT_ID: configured ? 'test-client' : '',
    GITHUB_OAUTH_CLIENT_SECRET: configured ? 'test-secret' : '',
    GITHUB_OAUTH_REDIRECT_URI: 'https://hack.r2049.cn/api/user/login/github/callback',
    NODE_CONFIG: JSON.stringify({
      github: { apiUrl: providerUrl, oauth: { baseUrl: providerUrl, clientId: '', clientSecret: '' } }
    })
  }
  app = spawn(process.execPath, ['dist/bin/app.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  app.stdout.on('data', data => { output += data })
  app.stderr.on('data', data => { output += data })
  for (let i = 0; i < 100; i += 1) {
    if (app.exitCode !== null) throw new Error(output)
    try {
      if ((await fetch(`${origin}/api/healthz`)).ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`Server did not start: ${output}`)
}
async function stop() {
  if (app && app.exitCode === null) {
    const done = once(app, 'exit')
    app.kill('SIGTERM')
    await done
  }
}
function browser() {
  const cookies = new Map()
  return {
    cookies,
    async get(url) {
      const response = await fetch(`${origin}${url}`, {
        redirect: 'manual',
        headers: { 'X-Forwarded-Proto': 'https', Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join('; ') }
      })
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(';')[0], at = pair.indexOf('=')
        cookies.set(pair.slice(0, at), pair.slice(at + 1))
      }
      return response
    }
  }
}
async function start(client) {
  const response = await client.get('/api/user/login/github')
  assert.equal(response.status, 302)
  const target = new URL(response.headers.get('location'))
  assert.equal(target.origin, providerUrl)
  assert.equal(target.pathname, '/login/oauth/authorize')
  assert.equal(target.searchParams.get('client_id'), 'test-client')
  assert.equal(target.searchParams.get('redirect_uri'), 'https://hack.r2049.cn/api/user/login/github/callback')
  assert.equal(target.searchParams.get('scope'), 'read:user user:email')
  assert.match(target.searchParams.get('state'), /^[a-f\d]{64}$/)
  assert.ok(response.headers.getSetCookie().filter(cookie => cookie.startsWith('HACKNICAL:session')).every(cookie => /httponly/i.test(cookie) && /secure/i.test(cookie) && /samesite=lax/i.test(cookie)), JSON.stringify(response.headers.getSetCookie()))
  return target.searchParams.get('state')
}
async function callback(client, state, code = 'good') {
  return client.get(`/api/user/login/github/callback?${new URLSearchParams({ code, state })}`)
}

before(async () => {
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hacknical-oauth-'))
  database = path.join(temporary, 'test.sqlite')
  provider = http.createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    if (request.url === '/login/oauth/access_token') {
      let body = ''
      for await (const data of request) body += data
      const params = new URLSearchParams(body)
      exchanges.push(Object.fromEntries(params))
      assert.equal(request.method, 'POST')
      assert.equal(params.get('client_secret'), 'test-secret')
      assert.equal(params.get('redirect_uri'), 'https://hack.r2049.cn/api/user/login/github/callback')
      if (params.get('code') === 'http-error') response.statusCode = 502
      response.end(JSON.stringify(params.get('code') === 'denied'
        ? { error: 'bad_verification_code' } : { access_token: 'test-private-token', ...(params.get('code') === 'expiring' ? { expires_in: 28800 } : {}) }))
    } else if (request.url === '/user' || request.url.startsWith('/users/octocat')) {
      if (profileFailure) response.statusCode = 401
      if (request.url.includes('/repos') || request.url.includes('/orgs')) {
        response.end(JSON.stringify([]))
      } else {
        response.end(JSON.stringify({ id: 123, login: 'octocat', name: 'Octocat', avatar_url: 'https://example.com/avatar.png' }))
      }
    } else {
      response.statusCode = 404
      response.end('{}')
    }
  })
  provider.listen(0, '127.0.0.1')
  await once(provider, 'listening')
  providerUrl = `http://127.0.0.1:${provider.address().port}`
  await launch()
})
after(async () => {
  await stop()
  if (provider) await new Promise(resolve => provider.close(resolve))
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true })
})

test('health check works without forwarded HTTPS or session cookies', async () => {
  const response = await fetch(`${origin}/api/healthz`)
  assert.deepEqual(await response.json(), { status: 'ok' })
  assert.equal(response.headers.get('set-cookie'), null)
})
test('landing page links to direct GitHub login', async () => {
  const response = await browser().get('/')
  assert.equal(response.status, 200)
  assert.match(await response.text(), /window.loginLink = "\/api\/user\/login\/github"/)
})
test('missing, forged and cross-browser OAuth states cannot exchange codes', async () => {
  const initial = exchanges.length
  assert.equal((await browser().get('/api/user/login/github/callback?code=good')).status, 400)
  const first = browser(), state = await start(first)
  assert.equal((await callback(browser(), state)).status, 400)
  assert.equal((await callback(first, 'wrong')).status, 400)
  assert.equal((await callback(first, state)).status, 400)
  assert.equal(exchanges.length, initial)
})
test('expired state is rejected', async () => {
  const client = browser(), state = await start(client)
  const db = new DatabaseSync(database)
  const id = client.cookies.get('HACKNICAL:session')
  const data = JSON.parse(db.prepare('SELECT data FROM sessions WHERE id = ?').get(id).data)
  data.githubOAuth.createdAt = Date.now() - 11 * 60 * 1000
  db.prepare('UPDATE sessions SET data = ? WHERE id = ?').run(JSON.stringify(data), id)
  db.close()
  assert.equal((await callback(client, state)).status, 400)
})
test('OAuth success persists user, rotates session, rejects replay, survives restart and logs out', async () => {
  const client = browser(), state = await start(client)
  const oldId = client.cookies.get('HACKNICAL:session')
  const response = await callback(client, state)
  assert.equal(response.status, 302)
  assert.equal(response.headers.get('location'), '/octocat')
  assert.notEqual(client.cookies.get('HACKNICAL:session'), oldId)
  assert.ok([...client.cookies.values()].every(value => !value.includes('test-private-token')))
  const db = new DatabaseSync(database)
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 1)
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM resumes').get().count, 1)
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM sessions WHERE id = ?').get(oldId).count, 0)
  const session = JSON.parse(db.prepare('SELECT data FROM sessions WHERE id = ?').get(client.cookies.get('HACKNICAL:session')).data)
  assert.equal(session.githubToken, 'test-private-token')
  assert.equal(session.githubAvator, 'https://example.com/avatar.png')
  db.close()
  assert.equal((await callback(client, state)).status, 400)
  await stop()
  await launch()
  const info = await client.get('/api/user/info')
  assert.equal((await info.json()).result.githubLogin, 'octocat')
  const updateStatus = await client.get('/api/github/update')
  const updateData = await updateStatus.json()
  assert.equal(updateData.success, true)
  assert.notEqual(updateData.result.status, 4)
  assert.notEqual(updateData.message, 'GitHub token 过期，请退出后重新登录')
  const activeId = client.cookies.get('HACKNICAL:session')
  await client.get('/api/user/logout')
  const check = new DatabaseSync(database)
  assert.equal(check.prepare('SELECT COUNT(*) AS count FROM sessions WHERE id = ?').get(activeId).count, 0)
  check.close()
  assert.equal((await client.get('/initial')).headers.get('location'), '/')
})
test('expiring OAuth tokens cap server sessions even when cookies are renewed', async () => {
  const client = browser(), state = await start(client)
  assert.equal((await callback(client, state, 'expiring')).headers.get('location'), '/octocat')
  const db = new DatabaseSync(database)
  const id = client.cookies.get('HACKNICAL:session')
  const row = db.prepare('SELECT data, expires_at FROM sessions WHERE id = ?').get(id)
  const session = JSON.parse(row.data)
  assert.ok(session.githubTokenExpiresAt > Date.now() + 7 * 60 * 60 * 1000)
  assert.ok(session.githubTokenExpiresAt < Date.now() + 8 * 60 * 60 * 1000)
  assert.equal(row.expires_at, session.githubTokenExpiresAt)
  // A renewed cookie must never extend authorization beyond provider expiry.
  await client.get('/api/user/info')
  assert.equal(db.prepare('SELECT expires_at FROM sessions WHERE id = ?').get(id).expires_at, row.expires_at)
  db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?').run(Date.now() - 1, id)
  assert.equal((await client.get('/initial')).headers.get('location'), '/')
  db.close()
})
test('provider cancellation consumes state and returns to the landing page', async () => {
  const client = browser(), state = await start(client)
  const response = await client.get(`/api/user/login/github/callback?state=${state}&error=access_denied`)
  assert.equal(response.headers.get('location'), '/?messageCode=github&messageType=error')
  assert.equal((await callback(client, state)).status, 400)
})
test('failed token exchanges and profile responses cannot log a user in', async () => {
  for (const code of ['denied', 'http-error', 'local:octocat']) {
    const client = browser(), state = await start(client)
    const response = await callback(client, state, code)
    assert.equal(response.headers.get('location'), '/?messageCode=github&messageType=error')
    assert.equal((await client.get('/initial')).headers.get('location'), '/')
  }
  profileFailure = true
  try {
    const client = browser(), state = await start(client)
    assert.equal((await callback(client, state)).headers.get('location'), '/?messageCode=github&messageType=error')
  } finally { profileFailure = false }
})
test('missing OAuth credentials leave health available and show a setup message', async () => {
  await stop()
  await launch(false)
  const response = await browser().get('/api/user/login/github')
  assert.equal(response.status, 503)
  assert.equal((await response.json()).code, 'GITHUB_OAUTH_UNAVAILABLE')
  assert.ok(!output.includes('test-private-token') && !output.includes('test-secret'))
})
