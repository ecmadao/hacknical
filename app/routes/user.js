import koaRouter from 'koa-router';
import User from '../controllers/user';
import platform from '../controllers/helper/platform';
import user from '../controllers/helper/user';
import check from '../controllers/helper/check';
import cache from '../controllers/helper/cache';

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

// initial finished
router.patch('/initialed',
  user.checkIfLogin(),
  User.initialFinished
);

// user login/logout/signup page
router.get('/login',
  user.checkIfNotLogin(),
  platform.checkPlatform,
  User.loginPage
);

// API
router.get('/logout', User.logout);

// github sections
router.get('/github_sections', User.getGithubShareSections);
router.post('/github_sections',
  user.checkIfLogin(),
  User.setGithubShareSections
);

router.get(
  '/repos/pinned',
  user.checkIfLogin(),
  User.getPinnedRepos
);
router.post(
  '/repos/pinned',
  user.checkIfLogin(),
  check.body('pinnedRepos'),
  User.setPinnedRepos,
  cache.del()
);

router.get('/login/github', User.githubLogin);

module.exports = router;
