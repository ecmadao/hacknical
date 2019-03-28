
import fs from 'fs'
import path from 'path'
import config from 'config'
import phantom from 'phantom'
import logger from '../utils/logger'
import { ensureFolder } from '../utils/files'

const SOURCE_PATH = config.get('downloads')

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

const clearFolder = folder =>
  fs.readdirSync(folder)
    .filter((item) => {
      const itempath = path.join(folder, item)
      return fs.statSync(itempath).isFile()
    })
    .forEach(file => fs.unlinkSync(path.join(folder, file)))

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

const ensureDownloadFolder = (folder) => {
  const resultFolder = path.resolve(__dirname, SOURCE_PATH, folder)
  ensureFolder(resultFolder)
  return resultFolder
}

export const downloadResume = async (url, options = {}) => {
  const {
    title,
    folder
  } = options

  const resultFolder = ensureDownloadFolder(folder)
  const filePath = path.resolve(resultFolder, title)
  const resultPath = `/downloads/${folder}/${title}`

  logger.info(`[RESUME:DOWNLOAD:RENDER-PATH] ${filePath}`)

  if (fs.existsSync(filePath)) return resultPath

  clearFolder(resultFolder)
  await renderScreenshot(url, filePath)
  return resultPath
}
