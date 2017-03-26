import koaRouter from 'koa-router';
import User from '../controllers/user';
import platform from '../controllers/helper/platform';
import user from '../controllers/helper/user';

const router = koaRouter({
  prefix: '/user'
});

// mobile dashboard page
router.get('/analysis/mobile',
  user.checkIfLogin(),
  platform.checkPlatform,
  platform.checkMobile('/dashboard'),
  User.mobileAnalysis
);
router.get('/setting/mobile',
  user.checkIfLogin(),
  platform.checkPlatform,
  platform.checkMobile('/dashboard'),
  User.mobileSetting
);

// user login/logout/signup page
router.get('/login',
  user.checkIfNotLogin(),
  platform.checkPlatform,
  User.loginPage
);

// API
router.get('/login/github', User.githubLogin);
router.get('/logout', User.logout);

// github sections
router.get('/githubSections', User.getGithubSections);
router.post('/githubSections',
  user.checkIfLogin(),
  User.setGithubSections
);

module.exports = router;
