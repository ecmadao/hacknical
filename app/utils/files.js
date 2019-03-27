/* eslint global-require: "off", import/no-dynamic-require: "off", no-unsafe-finally: "off" */

import fs from 'fs'
import path from 'path'
import logger from './logger'
import NewError from './error'

export const shadowImport = (folder, options) => {
  const {
    prefix,
    loader = null,
    params = [],
    excludes = [],
    nameFormatter,
    requiredExport,
    instantiation = false
  } = options

  const tmpExcludes = new Set(excludes)

  return fs.readdirSync(folder)
    .filter(
      name => !tmpExcludes.has(name)
    )
    .reduce((cur, name) => {
      const filepath = path.resolve(folder, name)
      try {
        let Module
        let result

        const isFile = fs.statSync(filepath).isFile()
        const type = isFile
          ? name.split('.').slice(0, -1).join('.')
          : name
        const fullpath = isFile
          ? filepath
          : `${filepath}/index.js`

        if (loader) {
          result = loader(fullpath, type)
        } else {
          Module = require(fullpath).default

          if (!Module || (requiredExport && Module[requiredExport] === undefined)) {
            throw new NewError.UnknownError(`Module.${requiredExport} missing for ${filepath}`)
          }

          result = instantiation
            ? new Module(...params)
            : Module
        }

        let key = nameFormatter ? nameFormatter(type) : type
        key = prefix ? `${prefix}.${key}` : key
        cur[Symbol.for(key)] = result
        logger.info(`Module ${filepath} load as ${key}`)
      } catch (e) {
        logger.error(e)
      } finally {
        return cur
      }
    }, {})
}

export const ensureFolder = fullpath =>
  fullpath.split('/').filter(item => item).reduce((list, part) => {
    list.push(part)
    const tmpPath = list.join('/')
    if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath)
    return list
  }, ['/'])
