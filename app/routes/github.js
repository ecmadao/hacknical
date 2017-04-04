import koaRouter from 'koa-router';
import GitHub from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import platform from '../controllers/helper/platform';
import analyse from '../controllers/helper/analyse';
import check from '../controllers/helper/check';

const router = koaRouter({
  prefix: '/github'
});

// zen & octocat
router.get(
  '/zen',
  GitHub.getZen
);
router.get(
  '/octocat',
  GitHub.getOctocat
);

// repos
router.get(
  '/repos',
  cache.get('repos', {
    keys: ['query.login', 'session.githubLogin']
  }),
  GitHub.getUserRepos,
  cache.set()
);
router.get(
  '/repos/all',
  user.checkSession(['githubToken', 'githubLogin']),
  GitHub.getAllRepos,
);
router.get(
  '/repos/initial',
  user.checkSession(['githubToken', 'githubLogin']),
  GitHub.fetchRepos,
);
// commits
router.get(
  '/commits',
  cache.get('commits', {
    keys: ['query.login', 'session.githubLogin']
  }),
  GitHub.getUserCommits,
  cache.set()
);
router.get(
  '/commits/initial',
  user.checkSession(['githubToken', 'githubLogin']),
  GitHub.fetchCommits,
);
// orgs
router.get(
  '/orgs',
  cache.get('orgs', {
    keys: ['query.login', 'session.githubLogin']
  }),
  GitHub.getUserOrgs,
  cache.set()
);
router.get(
  '/orgs/initial',
  user.checkSession(['githubToken', 'githubLogin']),
  GitHub.fetchOrgs,
);
router.get(
  '/share/records',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.getStareRecords
);
router.get(
  '/updateTime',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.getUpdateTime
);

// refresh github datas
router.put(
  '/repos/refresh',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.refreshRepos,
  cache.del()
);
router.put(
  '/commits/refresh',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.refreshCommits,
  cache.del()
);
router.put(
  '/orgs/refresh',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.refreshOrgs,
  cache.del()
);

router.get(
  '/user',
  user.checkSession(['userId']),
  GitHub.getUser
);

router.patch(
  '/share/status',
  user.checkSession(['userId', 'githubLogin']),
  check.body('enable'),
  GitHub.toggleShare,
);

router.get(
  '/:login',
  platform.checkPlatform,
  platform.checkMobile(),
  analyse.github,
  GitHub.sharePage
);
router.get(
  '/:login/mobile',
  platform.checkPlatform,
  platform.checkMobile(),
  analyse.github,
  GitHub.sharePageMobile
);

router.get(
  '/:login/user',
  cache.get('sharedUser', {
    params: ['login']
  }),
  GitHub.getSharedUser,
  cache.set()
);



module.exports = router;
