import phantom from 'phantom';
import path from 'path';
import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import logger from '../utils/logger';

const sourcePath = path.join(__dirname, '../../public/downloads');

const waitUntil = (asyncFunc) => {
  return new Promise((resolve, reject) => {
    const wait = () => {
      asyncFunc().then((value) => {
        if (value === true) {
          resolve();
        } else {
          setTimeout(wait, 100);
        }
      }).catch(function(e) {
        reject();
      });
    }
    wait();
  });
};

// makesure folder exist
fs.ensureDirSync(sourcePath);

const downloadResume = async (url, options = {}) => {
  const folder = options.folder || '';
  const title = options.title || 'resume.pdf';
  const resultFloder = path.join(sourcePath, folder);
  await fs.ensureDir(resultFloder);

  const filePath = path.join(resultFloder, title);
  const resultPath = `/downloads/${folder}/${title}`;

  if (fs.existsSync(filePath)) {
    return resultPath;
  }

  // clear files
  const files = klawSync(resultFloder, { nodir: true });
  for(let i = 0; i < files.length; i++) {
    const file = files[i].path;
    fs.removeSync(file);
  }

  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('viewportSize', { width: 1024, height: 600 });
  const status = await page.open(url);

  await waitUntil(() => {
    return page.evaluate(function() {
      return window.done;
    });
  });
  await page.render(filePath);
  logger.info(`[NEW DOWNLOAD] ${title}`);
  await instance.exit();
  return resultPath;
};


export default {
  resume: downloadResume
};
