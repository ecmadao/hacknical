import koaRouter from 'koa-router';
import User from '../controllers/user';
import platform from '../controllers/helper/platform';
import locale from '../controllers/helper/locale';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';

const router = koaRouter({
  prefix: '/user'
});

// dashboard page
router.get('/dashboard',
  platform.checkPlatform,
  user.checkIfLogin(),
  locale,
  User.dashboard
);
// mobile dashboard page
router.get('/analysis',
  platform.checkPlatform,
  user.checkIfLogin(),
  locale,
  User.mobileAnalysis
);
router.get('/setting',
  platform.checkPlatform,
  user.checkIfLogin(),
  locale,
  User.mobileSetting
);

// user login/logout/signup page
router.get('/login',
  platform.checkPlatform,
  user.checkIfNotLogin(),
  locale,
  User.loginPage
);

// API
router.get('/login/github', User.githubLogin);
router.post('/login', User.login);
router.post('/signup', User.signup);
router.get('/logout', User.logout);


module.exports = router;
