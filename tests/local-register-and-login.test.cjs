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
      let json = null
      try {
        json = JSON.parse(text)
      } catch {}
      return { status: response.status, headers: response.headers, text, json, ok: response.ok }
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
    },
    async put(url, data = {}) {
      const payload = {
        ...data,
        _csrf: csrfToken
      }
      const response = await fetch(`${origin}${url}`, {
        method: 'PUT',
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
    },
    async patch(url, data = {}) {
      const payload = {
        ...data,
        _csrf: csrfToken
      }
      const response = await fetch(`${origin}${url}`, {
        method: 'PATCH',
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

test('flow: resume edit, persist, share toggle, public access and reverse 404', async () => {
  // Use existing logged-in client for geeker
  const client = browser()
  await client.get('/')
  const loginRes = await client.post('/api/user/login/local', {
    account: 'geeker',
    password: 'super-secret-pwd'
  })
  assert.equal(loginRes.status, 200)
  // Browser redirects to user page after login, refreshing CSRF token
  await client.get(loginRes.json.url || "/geeker")

  // 1. Read initial resume data
  const initialDataRes = await client.get('/api/resume/data')
  assert.equal(initialDataRes.status, 200)
  const initialData = JSON.parse(initialDataRes.text)
  assert.equal(initialData.success, true)
  assert.ok(initialData.result.info)

  // 2. Verify getResumeInfo handles missing Origin header safely (no 500 error)
  const initialInfoRes = await client.get('/api/resume/info')
  assert.equal(initialInfoRes.status, 200)
  const initialInfo = JSON.parse(initialInfoRes.text)
  assert.equal(initialInfo.success, true)
  assert.ok(initialInfo.result.resumeHash)
  const resumeHash = initialInfo.result.resumeHash

  // 3. Update resume fields
  const updatedResume = {
    info: {
      name: '极客测试专家',
      title: '流控测试架构师',
      email: 'geeker@hacknical.com',
      phone: '13800000000',
      location: '上海',
      languages: ['JavaScript', 'TypeScript']
    },
    workExperiences: [
      {
        company: 'Antigravity Verification',
        position: 'Lead QA',
        startTime: '2023-01',
        endTime: '至今',
        details: '端到端全链路自动化与流控测试'
      }
    ],
    educations: [
      {
        school: '复旦大学',
        major: '软件工程',
        degree: '学士',
        startTime: '2016-09',
        endTime: '2020-06'
      }
    ],
    personalProjects: [],
    others: { socialLinks: [] },
    customModules: []
  }

  const saveRes = await client.put('/api/resume/data', {
    resume: updatedResume,
    locale: 'zh-CN'
  })
  assert.equal(saveRes.status, 200)
  assert.equal(saveRes.json.success, true)

  // 4. Re-read resume data to verify persistence
  const reReadRes = await client.get('/api/resume/data')
  assert.equal(reReadRes.status, 200)
  const reReadData = JSON.parse(reReadRes.text)
  assert.equal(reReadData.result.info.name, '极客测试专家')
  assert.equal(reReadData.result.info.title, '流控测试架构师')
  assert.equal(reReadData.result.workExperiences[0].company, 'Antigravity Verification')

  // 5. Open public share
  const shareToggleRes = await client.patch('/api/resume/info', {
    info: {
      openShare: true,
      simplifyUrl: true
    }
  })
  assert.equal(shareToggleRes.status, 200)
  assert.equal(shareToggleRes.json.success, true)

  // 6. Verify resume info returns updated public url
  const infoAfterShareRes = await client.get('/api/resume/info')
  assert.equal(infoAfterShareRes.status, 200)
  const infoAfterShare = JSON.parse(infoAfterShareRes.text)
  assert.equal(infoAfterShare.result.openShare, true)
  assert.equal(infoAfterShare.result.simplifyUrl, true)
  assert.match(infoAfterShare.result.url, /geeker\/resume/)

  // 7. Unauthenticated client accesses public resume page
  const unauthClient = browser()
  const publicPageRes = await unauthClient.get('/geeker/resume')
  assert.equal(publicPageRes.status, 200)
  assert.match(publicPageRes.text, /<title>geeker 的个人简历 \| hacknical<\/title>/)
  assert.match(publicPageRes.text, /window\.login = 'geeker'/)

  // 8. Unauthenticated client accesses public resume API
  const publicApiRes = await unauthClient.get(`/api/resume/shared/public?hash=${resumeHash}`)
  assert.equal(publicApiRes.status, 200)
  const publicApiData = JSON.parse(publicApiRes.text)
  assert.equal(publicApiData.success, true)
  assert.equal(publicApiData.result.info.name, '极客测试专家')
  assert.equal(publicApiData.result.workExperiences[0].company, 'Antigravity Verification')
  // Languages must be localized language options, NOT the skill tags from info.languages
  assert.deepEqual(publicApiData.result.languages, [{ id: 'zh', text: '中文' }])
  assert.deepEqual(publicApiData.result.info.languages, ['JavaScript', 'TypeScript'])

  // 8.1 Save an English resume version and verify multi-language independence
  const enResume = {
    ...updatedResume,
    info: {
      ...updatedResume.info,
      name: 'Geeker Lead QA',
      title: 'QA Architect'
    }
  }
  const saveEnRes = await client.put('/api/resume/data', {
    resume: enResume,
    locale: 'en'
  })
  assert.equal(saveEnRes.status, 200)

  // Verify English resume data
  const readEnRes = await client.get('/api/resume/data?locale=en')
  assert.equal(readEnRes.status, 200)
  const readEnData = JSON.parse(readEnRes.text)
  assert.equal(readEnData.result.info.name, 'Geeker Lead QA')

  // Verify Chinese resume remains intact
  const readZhRes = await client.get('/api/resume/data?locale=zh')
  assert.equal(readZhRes.status, 200)
  const readZhData = JSON.parse(readZhRes.text)
  assert.equal(readZhData.result.info.name, '极客测试专家')

  // Verify public API now returns both languages and handles locale switching
  const publicEnApiRes = await unauthClient.get(`/api/resume/shared/public?hash=${resumeHash}&locale=en`)
  assert.equal(publicEnApiRes.status, 200)
  const publicEnData = JSON.parse(publicEnApiRes.text)
  assert.equal(publicEnData.result.info.name, 'Geeker Lead QA')
  assert.deepEqual(publicEnData.result.languages, [
    { id: 'zh', text: '中文' },
    { id: 'en', text: 'English' }
  ])

  // 9. Disable public share
  const disableShareRes = await client.patch('/api/resume/info', {
    info: {
      openShare: false
    }
  })
  assert.equal(disableShareRes.status, 200)
  assert.equal(disableShareRes.json.result.openShare, false)

  // 10. Reverse verification: unauthenticated access redirects to 404
  const closedPageRes = await unauthClient.get('/geeker/resume')
  assert.equal(closedPageRes.status, 302)
  assert.equal(closedPageRes.headers.get('location'), '/404')

  const closedHashRes = await unauthClient.get(`/resume/${resumeHash}`)
  assert.equal(closedHashRes.status, 302)
  assert.equal(closedHashRes.headers.get('location'), '/404')
})

test('non-GitHub login does not execute GitHub operations and defaults to archive', async () => {
  const client = browser()
  await client.get('/')
  const loginRes = await client.post('/api/user/login/local', {
    account: 'geeker',
    password: 'super-secret-pwd'
  })
  assert.equal(loginRes.status, 200)

  // 1. Dashboard defaults to archive route for local login, and passes isGitHubUser=false
  const pageRes = await client.get('/geeker')
  assert.equal(pageRes.status, 200)
  assert.match(pageRes.text, /window\.dashboardRoute = "archive"/)
  assert.match(pageRes.text, /window\.isGitHubUser = "false"/)

  // 2. getUpdateStatus returns idle without token expired error
  const statusRes = await client.get('/api/github/update')
  assert.equal(statusRes.status, 200)
  assert.equal(statusRes.json.success, true)
  assert.equal(statusRes.json.result.status, 0)
  assert.equal(statusRes.json.result.finished, true)
  assert.equal(statusRes.json.result.refreshing, false)
  assert.equal(statusRes.json.message, '')

  // 3. updateUserData does not execute background update
  const updateRes = await client.put('/api/github/update')
  assert.equal(updateRes.status, 200)
  assert.equal(updateRes.json.success, true)
  assert.equal(updateRes.json.message, '')

  // 4. getAllRepositories returns empty
  const reposRes = await client.get('/api/github/repositories/all')
  assert.equal(reposRes.status, 200)
  assert.deepEqual(reposRes.json.result, [])

  // 5. octocat and zen return empty
  const octoRes = await client.get('/api/github/octocat')
  assert.equal(octoRes.status, 200)
  assert.equal(octoRes.json.result, '')

  const zenRes = await client.get('/api/github/zen')
  assert.equal(zenRes.status, 200)
  assert.equal(zenRes.json.result, '')

  // 6. Scientific statistic and predictions return empty
  const statRes = await client.get('/api/scientific/geeker/statistic')
  assert.equal(statRes.status, 200)
  assert.equal(statRes.json.result, null)

  const predRes = await client.get('/api/scientific/geeker/predictions')
  assert.equal(predRes.status, 200)
  assert.deepEqual(predRes.json.result, [])

  // 7. Visiting /geeker/github returns 404 for local user
  const githubPageRes = await client.get('/geeker/github')
  assert.equal(githubPageRes.status, 302)
  assert.equal(githubPageRes.headers.get('location'), '/404')

  // 8. githubSections defaults only to supported modules (info, repos, languages)
  const sectionsRes = await client.get('/api/user/github')
  assert.equal(sectionsRes.status, 200)
  assert.deepEqual(sectionsRes.json.result.map(s => s.id), ['info', 'repos', 'languages'])
})

