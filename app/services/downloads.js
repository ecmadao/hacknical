
import fs from 'fs'
import path from 'path'
import config from 'config'
import phantom from 'phantom'
import PATH from '../../config/path'
import logger from '../utils/logger'
import { ensureFolder } from '../utils/files'
import { uploadFile } from '../utils/uploader'

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

const renderScreenshot = async ({ input, output, pageConfig = {} }) => {
  const instance = await phantom.create()

  try {
    const page = await instance.createPage()

    if (pageConfig.pageStyle === 'onePage') {
      await page.property('viewportSize', { width: 1024, height: 600 })
    } else {
      await page.property('paperSize', {
        width: 1024,
        height: 1448,
        format: 'A4',
        margin: {
          top: '1cm',
          bottom: '1cm',
        },
        orientation: 'portrait'
      })
    }

    await page.open(input)
    await waitUntil(() => page.evaluate(() => window.done))
    await page.render(output)
  } catch (e) {
    logger.error(e)
  } finally {
    await instance.exit()
  }
}

const ensureDownloadFolder = (folder) => {
  const resultFolder = path.resolve(__dirname, `${PATH.ASSETS_PATH}/downloads`, folder)
  ensureFolder(resultFolder)
  return resultFolder
}

export const downloadResume = async (url, options = {}) => {
  const {
    title,
    folderName,
    pageStyle
  } = options

  const resultFolder = ensureDownloadFolder(folderName)
  const filePath = path.resolve(resultFolder, title)
  const resultPath = `/downloads/${folderName}/${title}`

  logger.info(`[RESUME:DOWNLOAD:RENDER-PATH] ${filePath}`)

  if (fs.existsSync(filePath)) {
    logger.info(`[RESUME:DOWNLOAD:RENDER-PATH:EXIST] ${filePath} -> ${resultPath}`)
    return resultPath
  }

  await renderScreenshot({
    input: url,
    output: filePath,
    pageConfig: {
      pageStyle
    }
  })
  uploadFile({
    filePath,
    prefix: `${config.get('services.oss.prefix')}/${folderName}`
  })
  return resultPath
}
