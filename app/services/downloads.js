import phantom from 'phantom';
import path from 'path';
import fs from 'fs';

const sourcePath = path.join(__dirname, '../../public/downloads');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
if (!fs.existsSync(sourcePath)) {
  fs.mkdirSync(sourcePath);
}

const downloadResume = async (url, title = 'resume') => {
  const instance = await phantom.create();
  const page = await instance.createPage();

  await page.property('viewportSize', {width: 1024, height: 600});
  const status = await page.open(url);
  console.log(`Page opened with status [${status}].`);

  await wait(7000);
  const filePath = path.join(sourcePath, `${title}-hacknical.pdf`);
  await page.render(filePath);
  console.log(`File created`);

  await instance.exit();
  return `/downloads/${title}-hacknical.pdf`;
};


export default {
  resume: downloadResume
};
