const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../frontend/utils/github.js'), 'utf8')
const start = source.indexOf('const getMonthlyCommitCounts =')
const end = source.indexOf('const getReposByLanguage =', start)
const getMonthlyCommitCounts = vm.runInNewContext(
  `${source.slice(start, end)}; getMonthlyCommitCounts`
)

test('monthly commits include the first week and handle month boundaries', () => {
  const dates = { 1: '2026-10-02', 2: '2026-10-09', 3: '2026-01-01' }
  const commits = [
    { week: 1, days: ['1', 2, 3, 4, 5, 6, 7] },
    { week: 2, days: [1, 1, 1, 1, 1, 1, 1] },
    { week: 3, days: [1, 2, 3, 4, 5, 6, 7] }
  ]

  const counts = getMonthlyCommitCounts(commits, week => dates[week])
  assert.deepEqual({ ...counts }, {
    '2026-10': 20,
    '2026-9': 15,
    '2026-1': 7,
    '2025-12': 21
  })
})
