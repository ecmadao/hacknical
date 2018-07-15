/* eslint global-require: "off", import/no-dynamic-require: "off", no-unsafe-finally: "off" */

import fs from 'fs';
import path from 'path';
import logger from './logger';

export const shadowImport = (folder, options) => {
  const {
    prefix,
    params = [],
    excludes = [],
    nameFormatter,
    requiredExport,
    instantiation = false,
  } = options;

  const tmpExcludes = new Set(excludes);

  return fs.readdirSync(folder)
    .filter(
      name => !tmpExcludes.has(name)
    )
    .reduce((cur, name) => {
      const filepath = path.resolve(folder, name);
      try {
        let type;
        let Module;

        if (fs.statSync(filepath).isFile()) {
          type = name.split('.').slice(0, -1).join('.');
          Module = require(filepath).default;
        } else {
          type = name;
          Module = require(`${filepath}/index.js`).default;
        }

        if (!Module || (requiredExport && Module[requiredExport] === undefined)) {
          throw new Error(`Module.${requiredExport} missing for ${filepath}`);
        }

        let key = nameFormatter ? nameFormatter(type) : type;
        key = prefix ? `${prefix}.${key}` : key;
        cur[Symbol.for(key)] = instantiation
          ? new Module(...params)
          : Module;
        logger.info(`Module ${filepath} load as ${key}`);
      } catch (e) {
        logger.error(e);
      } finally {
        return cur;
      }
    }, {});
};
