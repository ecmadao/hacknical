/* eslint global-require: "off" */

import path from 'path';
import fs from 'fs';
import PATH from '../../config/path';

let manifest = {};
const manifestPath = path.resolve('../config', 'webpack-assets.json');
if (fs.existsSync(manifestPath)) {
  manifest = require(`${manifestPath}`);
}

const getAssetName = asset => manifest[asset];

const assetsPath = (assetsName) => {
  const sections = assetsName.split('.');
  const name = sections.slice(0, -1).join('.');
  const type = sections.slice(-1)[0];
  const publicAsset = getAssetName(name);
  if (!publicAsset || !publicAsset[type]) {
    return `${PATH.CDN_URL}${assetsName}`;
  }
  return publicAsset[type];
};

export default assetsPath;
