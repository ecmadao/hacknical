
import koaRouter from 'koa-router'
import User from '../controllers/user'
import user from '../controllers/helper/user'
import check from '../controllers/helper/check'
import cache from '../controllers/helper/cache'

const router = koaRouter({
  prefix: '/api/user'
})

// initial finished
router.patch(
  '/initialed',
  user.checkIfLogin(),
  User.initialFinished
)

router.get(
  '/logout',
  User.logout
)

// API
router.get(
  '/clearCache',
  check.query('login'),
  User.clearCache,
  cache.del()
)

router.get(
  '/info',
  User.getUserInfo
)
router.get(
  '/github',
  User.getGitHubSections
)
router.patch(
  '/info',
  check.body('info'),
  User.patchUserInfo
)

router.get(
  '/login/github',
  User.loginByGitHub
)

router.get(
  '/notifies',
  user.checkIfLogin(),
  User.getUnreadNotifies
)
router.patch(
  '/notifies',
  user.checkIfLogin(),
  check.body('messageIds'),
  User.markNotifies
)
router.patch(
  '/notifies/:messageId',
  user.checkIfLogin(),
  check.body('vote'),
  User.voteNotify
)

module.exports = router
