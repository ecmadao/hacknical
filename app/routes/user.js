
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
router.patch(
  '/info',
  check.body('info'),
  User.setUserInfo
)

router.get(
  '/login/github',
  User.loginByGitHub
)

router.get(
  '/notifies/all',
  user.checkIfLogin(),
  User.getNotifies
)
router.put(
  '/notifies/read',
  user.checkIfLogin(),
  check.body('ids'),
  User.markNotifies
)
router.get(
  '/notifies/unread',
  user.checkIfLogin(),
  User.getUnreadNotifies
)
router.patch(
  '/notifies/upvote/:messageId',
  user.checkIfLogin(),
  User.notifyUpvote
)
router.patch(
  '/notifies/downvote/:messageId',
  user.checkIfLogin(),
  User.notifyDownvote
)

module.exports = router
