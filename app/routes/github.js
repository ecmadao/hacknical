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
  '/repositories',
  user.checkIfLogin(),
  cache.get('formattedRepos', {
    session: ['githubLogin']
  }),
  GitHub.getUserRepos,
  cache.set()
);
router.get(
  '/contributed',
  user.checkIfLogin(),
  cache.get('contributed', {
    session: ['githubLogin']
  }),
  GitHub.getUserContributed,
  cache.set()
);
router.get(
  '/repositories/all',
  user.checkIfLogin(),
  cache.get('allRepos', {
    keys: ['session.githubLogin']
  }),
  GitHub.getAllRepos,
  cache.set()
);
router.get(
  '/repositories/initial',
  user.checkIfLogin(),
  GitHub.fetchRepos,
);

// commits
router.get(
  '/commits',
  user.checkIfLogin(),
  cache.get('formattedCommits', {
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
  '/organizations',
  user.checkIfLogin(),
  cache.get('orgs', {
    session: ['githubLogin']
  }),
  GitHub.getUserOrgs,
  cache.set()
);
router.get(
  '/organizations/initial',
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
  '/repositories/refresh',
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
  '/organizations/refresh',
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
  '/:login/repositories',
  share.githubEnable(),
  cache.get('formattedRepos', {
    params: ['login']
  }),
  GitHub.getSharedRepos,
  cache.set()
);
router.get(
  '/:login/contributed',
  share.githubEnable(),
  cache.get('contributed', {
    params: ['login']
  }),
  GitHub.getSharedContributed,
  cache.set()
);
router.get(
  '/:login/commits',
  share.githubEnable(),
  cache.get('formattedCommits', {
    params: ['login']
  }),
  GitHub.getSharedCommits,
  cache.set()
);
router.get(
  '/:login/organizations',
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
