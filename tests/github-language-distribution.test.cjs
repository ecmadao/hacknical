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
const skillEnd = source.indexOf('const getLanguageUsed =', end)
const getLanguageSkill = vm.runInNewContext(
  `${source.slice(end, skillEnd)}; getLanguageSkill`
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

test('language stars add the first value and exclude unknown languages', () => {
  const repositories = [
    { language: null, stargazers_count: 4 },
    { language: 'TypeScript', stargazers_count: 2 },
    { language: 'TypeScript', stargazers_count: 3 },
    { language: 'Python', stargazers_count: undefined },
    { languages: { TypeScript: 100, Rust: 20 }, stargazers_count: 4 }
  ]

  const skills = getLanguageSkill(repositories)
  assert.deepEqual({ ...skills }, { TypeScript: 9, Rust: 4 })
})
