import koaRouter from 'koa-router';
import User from '../controllers/user';
import user from '../controllers/helper/user';
import check from '../controllers/helper/check';
import cache from '../controllers/helper/cache';

const router = koaRouter({
  prefix: '/user'
});

// initial finished
router.patch('/initialed',
  user.checkIfLogin(),
  User.initialFinished
);

// API
router.get('/logout', User.logout);
router.get(
  '/clearCache',
  check.query('login'),
  User.clearCache,
  cache.del()
);

router.get('/info', User.getUserInfo);
router.patch(
  '/info',
  check.body('info'),
  User.setUserInfo
);

router.get('/login/github', User.loginByGitHub);

module.exports = router;
