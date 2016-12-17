import path from 'path';
import fs from 'fs';
// import PATH from '../../config/webpack/build_path';

// let manifest = {};
// const manifestPath = path.resolve(PATH.BUILD_PATH, 'webpack_manifest.json');
// if (fs.existsSync(manifestPath)) {
//   manifest = require('../../public/assets/webpack_manifest.json');
// }
//
// function getAssetName(asset) {
//   return manifest[asset];
// }

export const assetsPath = (assetsName) => {
  const [filename, filetype] = assetsName.split('.');
  // const publicAsset = getAssetName(assetsName);
  return `/assets/${filename}.bundle.${filetype}`;
};
