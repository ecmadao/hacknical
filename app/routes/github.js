import koaRouter from 'koa-router';
import GitHub from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import platform from '../controllers/helper/platform';
import analyse from '../controllers/helper/analyse';
import check from '../controllers/helper/check';
import share from '../controllers/helper/share';

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
  user.checkIfLogin(),
  cache.get('repos', {
    session: ['githubLogin']
  }),
  GitHub.getUserRepos,
  cache.set()
);
router.get(
  '/repos/all',
  user.checkIfLogin(),
  cache.get('allRepos', {
    keys: ['session.githubLogin']
  }),
  GitHub.getAllRepos,
  cache.set()
);
router.get(
  '/repos/initial',
  user.checkIfLogin(),
  GitHub.fetchRepos,
);

// commits
router.get(
  '/commits',
  user.checkIfLogin(),
  cache.get('commits', {
    session: ['githubLogin']
  }),
  GitHub.getUserCommits,
  cache.set()
);
router.get(
  '/commits/initial',
  user.checkIfLogin(),
  GitHub.fetchCommits,
);

// orgs
router.get(
  '/orgs',
  user.checkIfLogin(),
  cache.get('orgs', {
    session: ['githubLogin']
  }),
  GitHub.getUserOrgs,
  cache.set()
);
router.get(
  '/orgs/initial',
  user.checkIfLogin(),
  GitHub.fetchOrgs,
);
router.get(
  '/share/records',
  user.checkIfLogin(),
  GitHub.getStareRecords
);
router.get(
  '/updateTime',
  user.checkIfLogin(),
  GitHub.getUpdateTime
);

// refresh github datas
router.put(
  '/repos/refresh',
  user.checkIfLogin(),
  GitHub.refreshRepos,
  cache.del()
);
router.put(
  '/commits/refresh',
  user.checkIfLogin(),
  GitHub.refreshCommits,
  cache.del()
);
router.put(
  '/orgs/refresh',
  user.checkIfLogin(),
  GitHub.refreshOrgs,
  cache.del()
);

router.get(
  '/user',
  user.checkIfLogin(),
  GitHub.getUser
);

router.patch(
  '/share/status',
  user.checkIfLogin(),
  check.body('enable'),
  GitHub.toggleShare,
);

router.get(
  '/:login',
  share.githubEnable(),
  platform.checkPlatform,
  platform.checkMobile(),
  analyse.github,
  GitHub.sharePage
);
router.get(
  '/:login/mobile',
  share.githubEnable(),
  platform.checkPlatform,
  platform.checkMobile(),
  analyse.github,
  GitHub.sharePageMobile
);
// share page's datas
router.get(
  '/:login/repos',
  share.githubEnable(),
  cache.get('repos', {
    params: ['login']
  }),
  GitHub.getSharedRepos,
  cache.set()
);
router.get(
  '/:login/commits',
  share.githubEnable(),
  cache.get('commits', {
    params: ['login']
  }),
  GitHub.getSharedCommits,
  cache.set()
);
router.get(
  '/:login/orgs',
  share.githubEnable(),
  cache.get('orgs', {
    params: ['login']
  }),
  GitHub.getSharedOrgs,
  cache.set()
);
router.get(
  '/:login/user',
  share.githubEnable(),
  cache.get('sharedUser', {
    params: ['login']
  }),
  GitHub.getSharedUser,
  cache.set()
);

module.exports = router;
