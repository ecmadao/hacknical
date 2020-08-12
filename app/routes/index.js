/* eslint global-require: "off" */

import fs from 'fs'
import path from 'path'
import koaRouter from 'koa-router'
import Home from '../controllers/home'
import GitHub from '../controllers/github'
import Resume from '../controllers/resume'
import user from '../controllers/helper/user'
import record from '../controllers/helper/record'
import share from '../controllers/helper/share'
import check from '../controllers/helper/check'
import cache from '../controllers/helper/cache'

const router = koaRouter()
const basename = path.basename(module.filename)

fs.readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file.split('.').slice(-1)[0] ===  'js') && (file !== basename)
  )
  .forEach((file) => {
    const route = require(path.join(__dirname, file))
    router.use(route.routes(), route.allowedMethods())
  })

router.get(
  '/',
  user.checkNotLogin(),
  Home.renderLandingPage
)
router.get(
  '/404',
  Home.render404Page
)
router.get(
  '/500',
  Home.render500Page
)
router.get(
  '/initial',
  user.checkIfLogin(),
  Home.renderInitialPage
)
router.get(
  '/:login',
  user.checkValidateUser(),
  Home.renderDashboard
)

router.get(
  '/api/statistic',
  Home.statistic
)
router.get(
  '/api/languages',
  Home.languages
)
router.get(
  '/api/icon',
  check.query('url', 'size'),
  cache.get('icon.v1', {
    keys: ['query.url', 'query.size']
  }),
  Home.getIcon,
  cache.set()
)

router.get(
  '/github/:login',
  share.githubEnable(),
  record.github('params.login'),
  record.ipGitHub('params.login'),
  GitHub.renderGitHubPage
)
router.get('/resume/:hash',
  share.resumeEnable('params.hash'),
  record.resume('params.hash'),
  record.ipResume('params.hash'),
  Resume.renderResumePage
)
router.get(
  '/:login/github',
  share.githubEnable(),
  record.github('params.login'),
  record.ipGitHub('params.login'),
  GitHub.renderGitHubPage
)
router.get(
  '/:login/resume',
  share.resumeEnable('params.login'),
  record.resume('params.login'),
  record.ipResume('params.login'),
  Resume.renderResumePage
)
router.get(
  '/:login/:dashboardRoute',
  user.checkValidateUser(),
  user.checkValidateDashboard(),
  Home.renderDashboard
)

export default router
