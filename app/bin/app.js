
import Koa from 'koa'
import path from 'path'
import koaLogger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import Csrf from 'koa-csrf'
import cors from '@koa/cors'
import locales from 'koa-locales'
import session from 'koa-session'
import config from 'config'
import nunjucks from 'nunjucks'
import views from 'koa-views'
import userAgent from 'koa-useragent'
import staticServer from 'koa-static'
import stackimpact from 'stackimpact'
import git from 'git-rev-sync'

import router from '../routes'
import logger from '../utils/logger'
import mqMiddleware from '../middlewares/mq'
import errorMiddleware from '../middlewares/error'
import localeMiddleware from '../middlewares/locale'
import assetsMiddleware from '../middlewares/assets'
import loggerMiddleware from '../middlewares/logger'
import { redisMiddleware } from '../middlewares/cache'
import platformMiddleware from '../middlewares/platform'
import firewallMiddleware from '../middlewares/firewall'

const port = config.get('port')
const appKey = config.get('appKey')
const appName = config.get('appName')

if (process.env.HACKNICAL_STACKIMPACT_KEY) {
  stackimpact.start({
    agentKey: process.env.HACKNICAL_STACKIMPACT_KEY,
    appName: process.env.HACKNICAL_STACKIMPACT_NAME,
    appVersion: git.short(),
    debug: process.env.NODE_ENV !== 'production'
  })
}

const app = new Koa()
app.proxy = true
app.keys = [appKey]

// koa logger
app.use(koaLogger())
app.use(firewallMiddleware({
  blockList: []
}))
app.use(cors())

// bodyparser
app.use(bodyParser({
  onerror: (err, ctx) => {
    ctx.throw('body parse error', 422)
  }
}))

// user-agent
app.use(userAgent)
app.use(platformMiddleware())
app.use(loggerMiddleware())

const options = {
  defaultLocale: 'zh-CN',
  dirs: [path.join(__dirname, '../config/locales')],
  localeAlias: {
    en: 'en-US',
    fr: 'fr-FR',
    zh: 'zh-CN'
  }
}
locales(app, options)


// session
const CONFIG = {
  key: `${appName.toUpperCase()}:session`, /** cookie key */
  maxAge: 24 * 60 * 60 * 1000 * 7, /** 7 days */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  renew: true, /** (boolean) renew session when session is nearly expired */
}
app.use(session(CONFIG, app))

// cache
app.use(redisMiddleware())
// mq
app.use(mqMiddleware())
// locale
app.use(localeMiddleware())
// catch error
app.use(errorMiddleware())
// csrf
app.use(new Csrf())
// helper func
app.use(async (ctx, next) => {
  ctx.state = Object.assign({}, ctx.state, {
    assetsPath: assetsMiddleware,
    csrf: ctx.csrf,
    env: process.env.NODE_ENV,
    footer: {
      about: ctx.__('dashboard.about'),
      feedback: ctx.__('dashboard.feedback'),
      code: ctx.__('dashboard.code'),
    }
  })
  await next()
})

// 配置nunjucks模板文件所在的路径，否则模板继承时无法使用相对路径
nunjucks.configure(path.join(__dirname, '../templates'), { autoescape: true })
// frontend static file
app.use(staticServer(
  path.join(__dirname, '../../public'),
  {
    gzip: true,
    maxage: 1 * 60 * 1000 // 1s
  }
))
// views with nunjucks
app.use(views(path.join(__dirname, '../templates'), {
  map: {
    html: 'nunjucks'
  }
}))
// router
app.use(router.routes(), router.allowedMethods())

const init = async () => {
  try {
    const appPort = process.env.PORT || port
    app.listen(appPort)
    logger.info(`Service start at port ${appPort}`)
  } catch (err) {
    logger.error(`[ERROR][${err || err.stack}]`)
  }
}

init()
