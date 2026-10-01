const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { DatabaseSync } = require('node:sqlite')

let app, origin, temporary, database, output = ''

async function unusedPort() {
  const server = http.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const port = server.address().port
  await new Promise(resolve => server.close(resolve))
  return port
}

async function launch() {
  const port = await unusedPort()
  origin = `http://127.0.0.1:${port}`
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
    APP_URL: 'https://hack.r2049.cn',
    APP_KEY: 'b'.repeat(64),
    SQLITE_PATH: database,
    LOG_LEVEL: 'ERROR',
    INVITE_CODES: 'TEST-CODE-1,TEST-CODE-2,TEST-CODE-3',
    GITHUB_API_URL: 'https://api.github.com',
    GITHUB_OAUTH_CLIENT_ID: 'dummy-id',
    GITHUB_OAUTH_CLIENT_SECRET: 'dummy-secret',
    GITHUB_OAUTH_REDIRECT_URI: 'https://hack.r2049.cn/api/user/login/github/callback'
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
  let csrfToken = ''

  return {
    cookies,
    getCsrfToken() { return csrfToken },
    async get(url) {
      const response = await fetch(`${origin}${url}`, {
        redirect: 'manual',
        headers: {
          'X-Forwarded-Proto': 'https',
          Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ')
        }
      })
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(';')[0], at = pair.indexOf('=')
        cookies.set(pair.slice(0, at), pair.slice(at + 1))
      }
      const text = await response.text()
      const match = text.match(/<meta name="csrf-token" content="([^"]+)">/)
      if (match) {
        csrfToken = match[1]
      }
      return { status: response.status, headers: response.headers, text, ok: response.ok }
    },
    async post(url, data = {}) {
      const payload = {
        ...data,
        _csrf: csrfToken
      }
      const response = await fetch(`${origin}${url}`, {
        method: 'POST',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Proto': 'https',
          Cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ')
        },
        body: JSON.stringify(payload)
      })
      for (const cookie of response.headers.getSetCookie()) {
        const pair = cookie.split(';')[0], at = pair.indexOf('=')
        cookies.set(pair.slice(0, at), pair.slice(at + 1))
      }
      let json = null
      const text = await response.text()
      try {
        json = JSON.parse(text)
      } catch {}
      return { status: response.status, headers: response.headers, json, text }
    }
  }
}

before(async () => {
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hacknical-local-auth-'))
  database = path.join(temporary, 'test.sqlite')
  await launch()
})

after(async () => {
  await stop()
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true })
})

test('registration rejects invalid, missing or consumed invite code', async () => {
  const client = browser()
  await client.get('/') // get csrf token and initial session

  // Missing invite code
  const res1 = await client.post('/api/user/signup', {
    username: 'user001',
    email: 'user001@example.com',
    password: 'password123',
    inviteCode: ''
  })
  assert.equal(res1.status, 400)
  assert.equal(res1.json.success, false)
  assert.match(res1.json.message, /邀请码/)

  // Invalid invite code
  const res2 = await client.post('/api/user/signup', {
    username: 'user001',
    email: 'user001@example.com',
    password: 'password123',
    inviteCode: 'NON-EXISTENT-CODE'
  })
  assert.equal(res2.status, 400)
  assert.equal(res2.json.success, false)
  assert.match(res2.json.message, /邀请码不存在/)
})

test('registration validates username, email and password format', async () => {
  const client = browser()
  await client.get('/')

  // Invalid username (too short or invalid chars)
  const resShortUser = await client.post('/api/user/signup', {
    username: 'ab',
    email: 'valid@example.com',
    password: 'password123',
    inviteCode: 'TEST-CODE-1'
  })
  assert.equal(resShortUser.status, 400)
  assert.match(resShortUser.json.message, /用户名/)

  // Reserved username
  const resReserved = await client.post('/api/user/signup', {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    inviteCode: 'TEST-CODE-1'
  })
  assert.equal(resReserved.status, 400)
  assert.match(resReserved.json.message, /保留/)

  // Invalid email
  const resBadEmail = await client.post('/api/user/signup', {
    username: 'gooduser',
    email: 'not-an-email',
    password: 'password123',
    inviteCode: 'TEST-CODE-1'
  })
  assert.equal(resBadEmail.status, 400)
  assert.match(resBadEmail.json.message, /邮箱/)

  // Too short password
  const resShortPass = await client.post('/api/user/signup', {
    username: 'gooduser',
    email: 'gooduser@example.com',
    password: '123',
    inviteCode: 'TEST-CODE-1'
  })
  assert.equal(resShortPass.status, 400)
  assert.match(resShortPass.json.message, /密码/)
})

test('successful registration consumes invite code, creates user and resume, and establishes session', async () => {
  const client = browser()
  await client.get('/')

  const signupRes = await client.post('/api/user/signup', {
    username: 'geeker',
    email: 'geeker@hacknical.com',
    password: 'super-secret-pwd',
    inviteCode: 'TEST-CODE-1'
  })

  assert.equal(signupRes.status, 200)
  assert.equal(signupRes.json.success, true)
  assert.equal(signupRes.json.url, '/geeker')
  assert.equal(signupRes.json.result.githubLogin, 'geeker')
  assert.equal(signupRes.json.result.email, 'geeker@hacknical.com')

  // Verify in SQLite database directly
  const db = new DatabaseSync(database)
  const codeRow = db.prepare('SELECT * FROM invite_codes WHERE code = ?').get('TEST-CODE-1')
  assert.equal(codeRow.used, 1)
  assert.ok(codeRow.used_by)
  assert.ok(codeRow.used_at)

  const userRow = db.prepare('SELECT * FROM users WHERE github_login = ?').get('geeker')
  assert.ok(userRow)
  assert.equal(userRow.email, 'geeker@hacknical.com')
  assert.equal(userRow.auth_provider, 'local')
  assert.equal(userRow.initialed, 1)
  // Ensure password is not plain text
  assert.notEqual(userRow.password_hash, 'super-secret-pwd')
  assert.match(userRow.password_hash, /^[a-f0-9]+:[a-f0-9]+$/)

  const resumeRow = db.prepare('SELECT * FROM resumes WHERE user_id = ?').get(userRow.user_id)
  assert.ok(resumeRow)

  // Verify that reusing the consumed invite code is rejected (using fresh client/csrf)
  const anotherClient = browser()
  await anotherClient.get('/')
  const replayRes = await anotherClient.post('/api/user/signup', {
    username: 'another_user',
    email: 'another@hacknical.com',
    password: 'another-password',
    inviteCode: 'TEST-CODE-1'
  })
  assert.equal(replayRes.status, 400)
  assert.match(replayRes.json.message, /已被使用/)

  // Verify session allows access to /geeker dashboard
  const dashboardRes = await client.get('/geeker')
  assert.equal(dashboardRes.status, 200)
  assert.match(dashboardRes.text, /window\.login = "geeker"/)
  assert.match(dashboardRes.text, /window\.isAdmin = "true"/)

  // Verify userInfo API
  const infoRes = await client.get('/api/user/info')
  const info = JSON.parse(infoRes.text)
  assert.equal(info.success, true)
  assert.equal(info.result.githubLogin, 'geeker')
})

test('cannot register with duplicate username or duplicate email (case-insensitive)', async () => {
  const client = browser()
  await client.get('/')

  // Duplicate username (with different case)
  const dupUserRes = await client.post('/api/user/signup', {
    username: 'GEEKER',
    email: 'different@hacknical.com',
    password: 'password123',
    inviteCode: 'TEST-CODE-2'
  })
  assert.equal(dupUserRes.status, 400)
  assert.match(dupUserRes.json.message, /用户名已被注册/)

  // Duplicate email (with different case)
  const dupEmailRes = await client.post('/api/user/signup', {
    username: 'new_unique_name',
    email: 'GEEKER@hacknical.com',
    password: 'password123',
    inviteCode: 'TEST-CODE-2'
  })
  assert.equal(dupEmailRes.status, 400)
  assert.match(dupEmailRes.json.message, /邮箱已被注册/)
})

test('login via username or email with password, and reject wrong password', async () => {
  const client = browser()
  await client.get('/')

  // Wrong password
  const wrongPass = await client.post('/api/user/login/local', {
    account: 'geeker',
    password: 'wrong-password'
  })
  assert.equal(wrongPass.status, 400)
  assert.equal(wrongPass.json.success, false)
  assert.match(wrongPass.json.message, /账号或密码错误/)

  // Non-existent account
  const nonExist = await client.post('/api/user/login/local', {
    account: 'nobody-here',
    password: 'any-password'
  })
  assert.equal(nonExist.status, 400)
  assert.match(nonExist.json.message, /账号或密码错误/)

  // Success login via username
  const loginByUser = await client.post('/api/user/login/local', {
    account: 'geeker',
    password: 'super-secret-pwd'
  })
  assert.equal(loginByUser.status, 200)
  assert.equal(loginByUser.json.success, true)
  assert.equal(loginByUser.json.url, '/geeker')

  // Access user page
  const pageRes = await client.get('/geeker')
  assert.equal(pageRes.status, 200)
  assert.match(pageRes.text, /window\.isAdmin = "true"/)

  // Logout
  const logoutRes = await client.get('/api/user/logout')
  assert.equal(logoutRes.status, 302)

  // Refresh CSRF after logout
  await client.get('/')

  // Success login via email
  const loginByEmail = await client.post('/api/user/login/local', {
    account: 'geeker@hacknical.com',
    password: 'super-secret-pwd'
  })
  assert.equal(loginByEmail.status, 200)
  assert.equal(loginByEmail.json.success, true)
  assert.equal(loginByEmail.json.url, '/geeker')
})
