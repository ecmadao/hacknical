/* eslint global-require: "off" */

import path from 'path';
import fs from 'fs';
import PATH from '../../config/path';
import logger from '../utils/logger';

let manifest = {};
const manifestPath = path.resolve(__dirname, '../config', 'webpack-assets.json');
if (fs.existsSync(manifestPath)) {
  manifest = require(`${manifestPath}`);
}

const getAssetName = asset => manifest[asset];

const assetsPath = (assetsName) => {
  const sections = assetsName.split('.');
  const name = sections.slice(0, -1).join('.');
  const type = sections.slice(-1)[0];
  const publicAsset = getAssetName(name);

  let result = '';
  if (!publicAsset || !publicAsset[type]) {
    result = `${PATH.CDN_URL}${assetsName}`;
  }
  result = publicAsset[type];
  logger.info(`[ASSETS] ${result}`);
  return result;
};

export default assetsPath;
