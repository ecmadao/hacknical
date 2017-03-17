import koaRouter from 'koa-router';
import User from '../controllers/user';
import platform from '../controllers/helper/platform';
import user from '../controllers/helper/user';

const router = koaRouter({
  prefix: '/user'
});

// dashboard page
router.get('/dashboard',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.dashboard
);
// mobile dashboard page
router.get('/analysis',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileAnalysis
);
router.get('/setting',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileSetting
);

// user login/logout/signup page
router.get('/login',
  platform.checkPlatform,
  user.checkIfNotLogin(),
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
