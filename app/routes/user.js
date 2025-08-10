
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

// Email authentication routes
router.post(
  '/register',
  check.body('email'),
  check.body('password'),
  User.registerByEmail
)

router.post(
  '/login/email',
  check.body('email'),
  check.body('password'),
  User.loginByEmail
)

router.get(
  '/verify-email',
  User.verifyEmail
)

router.post(
  '/verify-email',
  User.verifyEmail
)

router.post(
  '/reset-password',
  check.body('email'),
  User.requestPasswordReset
)

router.post(
  '/confirm-reset-password',
  check.body('token'),
  check.body('newPassword'),
  User.confirmPasswordReset
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
