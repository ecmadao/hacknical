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
  locale,
  platform.checkPlatform,
  user.checkIfLogin(),
  User.dashboard
);
// mobile dashboard page
router.get('/analysis',
  locale,
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileAnalysis
);
router.get('/setting',
  locale,
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileSetting
);

// user login/logout/signup page
router.get('/login',
  locale,
  platform.checkPlatform,
  user.checkIfNotLogin(),
  User.loginPage
);

// API
router.get('/login/github', User.githubLogin);
router.post('/login', User.login);
router.post('/signup', User.signup);
router.get('/logout', User.logout);


module.exports = router;
