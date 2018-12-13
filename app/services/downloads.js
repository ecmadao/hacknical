
import phantom from 'phantom'
import path from 'path'
import fs from 'fs-extra'
import klawSync from 'klaw-sync'
import config from 'config'
import logger from '../utils/logger'
// import webpage from 'webpage'

const sourcePath = config.get('downloads')

const waitUntil = asyncFunc => new Promise((resolve, reject) => {
  const wait = () => {
    asyncFunc().then((value) => {
      if (value === true) {
        resolve()
      } else {
        setTimeout(wait, 100)
      }
    }).catch(reject)
  }
  wait()
})

const clearFolder = (folder) => {
  const files = klawSync(folder, { nodir: true })
  for (const file of files) {
    fs.removeSync(file.path)
  }
}

const renderScreenshot = async (input, output) => {
  const instance = await phantom.create()
  const page = await instance.createPage()

  await page.property('paperSize', {
    width: 1024,
    height: 1448,
    format: 'A4',
    orientation: 'portrait'
  })
  await page.open(input)

  await waitUntil(() => page.evaluate(() => window.done))
  await page.render(output)
  await instance.exit()
}

const downloadResume = async (url, options = {}) => {
  const {
    title,
    folder
  } = options
  const resultFloder = path.resolve(__dirname, sourcePath, folder)

  // makesure folder exist
  await fs.ensureDirSync(sourcePath)
  await fs.ensureDir(resultFloder)

  const filePath = path.resolve(resultFloder, title)
  const resultPath = `/downloads/${folder}/${title}`
  logger.info(`[RESUME:DOWNLOAD:RENDER-PATH] ${filePath}`)

  if (fs.existsSync(filePath)) {
    return resultPath
  }

  clearFolder(resultFloder)
  await renderScreenshot(url, filePath)
  return resultPath
}

export default {
  resume: downloadResume
}
