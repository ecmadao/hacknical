const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

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
    APP_KEY: 'c'.repeat(64),
    SQLITE_PATH: database,
    LOG_LEVEL: 'ERROR',
    INVITE_CODES: 'MULTI-CODE-1,MULTI-CODE-2',
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
    },
    async delete(url, data = {}) {
      const payload = {
        ...data,
        _csrf: csrfToken
      }
      const response = await fetch(`${origin}${url}`, {
        method: 'DELETE',
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
  temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hacknical-multi-resume-'))
  database = path.join(temporary, 'test.sqlite')
  await launch()
})

after(async () => {
  await stop()
  if (temporary) fs.rmSync(temporary, { recursive: true, force: true })
})

test('multi-resume workflow: create, list, edit independently, switch default, copy, and delete with protection', async () => {
  const client = browser()
  await client.get('/')

  // 1. 注册新用户
  const signupRes = await client.post('/api/user/signup', {
    username: 'multidev',
    email: 'multidev@example.com',
    password: 'password123',
    inviteCode: 'MULTI-CODE-1'
  })
  assert.equal(signupRes.status, 200)
  assert.equal(signupRes.json.success, true)

  // 访问仪表盘刷新 csrf
  await client.get('/multidev')

  // 2. 检查初始简历列表，默认有 1 份默认简历
  const listRes1 = await client.get('/api/resume/list')
  assert.equal(listRes1.status, 200)
  assert.equal(listRes1.json.success, true)
  assert.equal(listRes1.json.result.length, 1)

  const firstResume = listRes1.json.result[0]
  assert.equal(firstResume.title, '默认简历')
  assert.equal(firstResume.isDefault, true)
  const firstResumeId = firstResume.resumeId
  const firstResumeHash = firstResume.resumeHash
  assert.ok(firstResumeId)
  assert.ok(firstResumeHash)

  // 3. 编辑第 1 份简历内容
  const updateRes1 = await client.put('/api/resume/data', {
    resumeId: firstResumeId,
    resume: {
      info: {
        name: '多简历开发者1',
        title: '前端架构师',
        email: 'multidev@example.com'
      }
    }
  })
  assert.equal(updateRes1.status, 200)
  assert.equal(updateRes1.json.success, true)

  // 4. 创建第 2 份简历
  const createRes = await client.post('/api/resume/new', {
    title: '全栈开发简历'
  })
  assert.equal(createRes.status, 200)
  assert.equal(createRes.json.success, true)
  const secondResume = createRes.json.result
  const secondResumeId = secondResume.resumeId
  assert.ok(secondResumeId)
  assert.equal(secondResume.title, '全栈开发简历')
  assert.notEqual(secondResumeId, firstResumeId)

  // 检查列表，应该有 2 份简历，且第 1 份仍为默认
  const listRes2 = await client.get('/api/resume/list')
  assert.equal(listRes2.json.result.length, 2)
  const defaultItem = listRes2.json.result.find(r => r.isDefault)
  assert.equal(defaultItem.resumeId, firstResumeId)

  // 5. 编辑第 2 份简历，验证与第 1 份数据隔离
  await client.put('/api/resume/data', {
    resumeId: secondResumeId,
    resume: {
      info: {
        name: '多简历开发者2',
        title: '全栈总监',
        email: 'multidev2@example.com'
      }
    }
  })

  // 获取第 1 份数据，确认其 title 依然是 '前端架构师'
  const resume1Data = await client.get(`/api/resume/data?resumeId=${firstResumeId}`)
  assert.equal(resume1Data.json.result.info.title, '前端架构师')

  // 获取第 2 份数据，确认其 title 是 '全栈总监'
  const resume2Data = await client.get(`/api/resume/data?resumeId=${secondResumeId}`)
  assert.equal(resume2Data.json.result.info.title, '全栈总监')

  // 6. 测试简历复制功能：基于第 2 份简历复制一份
  const copyRes = await client.post('/api/resume/copy', {
    resumeId: secondResumeId,
    title: '全栈海外版'
  })
  assert.equal(copyRes.status, 200)
  assert.equal(copyRes.json.success, true)
  const thirdResumeId = copyRes.json.result.resumeId

  // 获取复制出的第 3 份简历内容，确认内容继承自第 2 份
  const resume3Data = await client.get(`/api/resume/data?resumeId=${thirdResumeId}`)
  assert.equal(resume3Data.json.result.info.title, '全栈总监')

  // 简历总数现在为 3 份
  const listRes3 = await client.get('/api/resume/list')
  assert.equal(listRes3.json.result.length, 3)

  // 7. 测试重命名功能
  const renameRes = await client.post('/api/resume/rename', {
    resumeId: thirdResumeId,
    title: '海外技术专家'
  })
  assert.equal(renameRes.status, 200)
  assert.equal(renameRes.json.result.title, '海外技术专家')

  // 8. 测试切换默认简历：将第 2 份设为默认
  const setDefaultRes = await client.post('/api/resume/default', {
    resumeId: secondResumeId
  })
  assert.equal(setDefaultRes.status, 200)
  const listAfterDefault = setDefaultRes.json.result
  const newDefault = listAfterDefault.find(r => r.isDefault)
  assert.equal(newDefault.resumeId, secondResumeId)

  // 开启第 2 份简历的分享
  await client.patch('/api/resume/info', {
    resumeId: secondResumeId,
    info: { openShare: true, simplifyUrl: true }
  })

  // 9. 验证公开访问：
  // 匿名访问个性化域名 /multidev/resume 应该指向默认简历（即第 2 份简历）
  const unauthClient = browser()
  const publicLoginRes = await unauthClient.get('/multidev/resume')
  assert.equal(publicLoginRes.status, 200)
  assert.match(publicLoginRes.text, /resume/)

  // 10. 测试删除简历：删除第 3 份简历
  const deleteRes1 = await client.delete(`/api/resume/${thirdResumeId}`)
  assert.equal(deleteRes1.status, 200)
  assert.equal(deleteRes1.json.result.length, 2)

  // 11. 测试删除默认简历：删除第 2 份（当前默认），系统自动将剩余的第 1 份简历设为默认
  const deleteRes2 = await client.delete(`/api/resume/${secondResumeId}`)
  assert.equal(deleteRes2.status, 200)
  assert.equal(deleteRes2.json.result.length, 1)
  assert.equal(deleteRes2.json.result[0].resumeId, firstResumeId)
  assert.equal(deleteRes2.json.result[0].isDefault, true)

  // 12. 测试删除保护：尝试删除最后剩余的唯一一份简历，应当被拒绝
  const deleteResFail = await client.delete(`/api/resume/${firstResumeId}`)
  assert.equal(deleteResFail.status, 400)
  assert.match(deleteResFail.json.message, /至少需要保留一份简历/)
})
