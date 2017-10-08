import phantom from 'phantom';
import path from 'path';
import fs from 'fs-extra';
import klawSync from 'klaw-sync';

const sourcePath = path.join(__dirname, '../../public/downloads');

const waitUntil = asyncFunc => new Promise((resolve, reject) => {
  const wait = () => {
    asyncFunc().then((value) => {
      if (value === true) {
        resolve();
      } else {
        setTimeout(wait, 100);
      }
    }).catch((e) => {
      reject(e);
    });
  }
  wait();
});

const downloadResume = async (url, options = {}) => {
  const folder = options.folder || '';
  const title = options.title || 'resume.pdf';
  const resultFloder = path.join(sourcePath, folder);

  // makesure folder exist
  await fs.ensureDirSync(sourcePath);
  await fs.ensureDir(resultFloder);

  const filePath = path.join(resultFloder, title);
  const resultPath = `/downloads/${folder}/${title}`;

  if (fs.existsSync(filePath)) {
    return resultPath;
  }

  // clear files
  const files = klawSync(resultFloder, { nodir: true });
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i].path;
    fs.removeSync(file);
  }

  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('viewportSize', { width: 1024, height: 600 });
  await page.open(url);

  await waitUntil(() => page.evaluate(() => window.done));
  await page.render(filePath);
  await instance.exit();
  return resultPath;
};

export default {
  resume: downloadResume
};
