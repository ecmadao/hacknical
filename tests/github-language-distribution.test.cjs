const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../frontend/utils/github.js'), 'utf8')
const start = source.indexOf('const getLanguageDistribution =')
const end = source.indexOf('const getLanguageSkill =', start)
const getLanguageDistribution = vm.runInNewContext(
  `${source.slice(start, end)}; getLanguageDistribution`
)

test('repository language counts exclude unknown languages', () => {
  const repositories = [
    { language: null },
    { language: 'TypeScript' },
    { language: null },
    { language: 'Rust' },
    { language: 'TypeScript' },
    { language: undefined }
  ]

  const distribution = getLanguageDistribution(repositories)
  assert.deepEqual({ ...distribution }, { TypeScript: 2, Rust: 1 })
})
