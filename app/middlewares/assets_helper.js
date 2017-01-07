import path from 'path';
import fs from 'fs';
import PATH from '../../config/webpack/path';

let manifest = {};
const manifestPath = path.resolve(PATH.BUILD_PATH, 'webpack_manifest.json');
if (fs.existsSync(manifestPath)) {
  manifest = require(`${manifestPath}`);
}

function getAssetName(asset) {
  return manifest[asset];
}

const assetsPath = (assetsName) => {
  // const [filename, filetype] = assetsName.split('.');
  const publicAsset = getAssetName(assetsName);
  return `/assets/${publicAsset}`;
  // return `/assets/${filename}.bundle.${filetype}`;
};

export default assetsPath;
