import path from 'path';
import fs from 'fs';
import config from 'config';

import PATH from '../../config/path';
import CDN from './cdn';

let manifest = {};
const manifestPath = path.resolve(PATH.BUILD_PATH, 'webpack_manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = require(`${manifestPath}`);
}

function getAssetName(asset) {
  return manifest[asset];
}

const assetsPath = (assetsName) => {
  const publicAsset = getAssetName(assetsName);
  if (!publicAsset) {
    return `${CDN.URL}/${assetsName}`;
  }
  return publicAsset;
};

export default assetsPath;
