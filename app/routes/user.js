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

// github sections
router.get('/githubSections', User.getGithubShareSections);
router.patch('/githubSections',
  user.checkIfLogin(),
  User.setGithubShareSections
);

router.get(
  '/repos/pinned',
  user.checkIfLogin(),
  User.getPinnedRepos
);
router.patch(
  '/repos/pinned',
  user.checkIfLogin(),
  check.body('pinnedRepos'),
  User.setPinnedRepos,
  cache.del()
);

router.get('/login/github', User.githubLogin);

module.exports = router;
