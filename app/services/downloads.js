import phantom from 'phantom';
import path from 'path';
import fs from 'fs-extra';
import klawSync from 'klaw-sync';

const sourcePath = path.join(__dirname, '../../public/downloads');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
// makesure folder exist
const makesureFolder = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
makesureFolder(sourcePath);

const downloadResume = async (url, options = {}) => {
  const folder = options.folder || '';
  const title = options.title || 'resume.pdf';
  const resultFloder = path.join(sourcePath, folder);
  makesureFolder(resultFloder);

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

  await page.property('viewportSize', {width: 1024, height: 600});
  const status = await page.open(url);

  await wait(7000);
  await page.render(filePath);

  await instance.exit();
  return resultPath;
};


export default {
  resume: downloadResume
};
