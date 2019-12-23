
import path from 'path'
import fs from 'fs'

const libFolder = path.join(__dirname, 'lib')

export const SCHOOLS = fs.readdirSync(libFolder).reduce((map, filename) => {
  const type = filename.replace(/\.csv$/, '')
  const schools = fs.readFileSync(
    path.join(libFolder, filename)
  ).toString().split('\n')

  for (const school of schools) {
    const types = map.get(school) || []
    types.push(type)
    map.set(school, types)
  }
  return map
}, new Map())
