import koaRouter from 'koa-router';
import GitHub from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
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
  '/repositories/all',
  user.checkIfLogin(),
  cache.get('allRepositories', {
    keys: ['session.githubLogin']
  }),
  GitHub.getAllRepositories,
  cache.set()
);
router.get(
  '/repositories/initial',
  user.checkIfLogin(),
  GitHub.fetchRepositories,
);

// commits
router.get(
  '/commits/initial',
  user.checkIfLogin(),
  GitHub.fetchCommits,
);

// orgs
router.get(
  '/organizations/initial',
  user.checkIfLogin(),
  GitHub.fetchOrganizations,
);
router.get(
  '/share/records',
  user.checkIfLogin(),
  GitHub.getShareRecords
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
  GitHub.refreshRepositories,
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
  GitHub.refreshOrganizations,
  cache.del()
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
  analyse.github(),
  GitHub.githubPage
);

// share page's datas
router.get(
  '/:login/repositories',
  share.githubEnable(),
  cache.get('user-repositories', {
    params: ['login']
  }),
  GitHub.getUserRepositories,
  cache.set()
);
router.get(
  '/:login/contributed',
  share.githubEnable(),
  cache.get('user-contributed', {
    params: ['login']
  }),
  GitHub.getUserContributed,
  cache.set()
);
router.get(
  '/:login/commits',
  share.githubEnable(),
  cache.get('user-commits', {
    params: ['login']
  }),
  GitHub.getUserCommits,
  cache.set()
);
router.get(
  '/:login/organizations',
  share.githubEnable(),
  cache.get('user-organizations', {
    params: ['login']
  }),
  GitHub.getUserOrganizations,
  cache.set()
);
router.get(
  '/:login/info',
  share.githubEnable(),
  cache.get('user-github', {
    params: ['login']
  }),
  GitHub.getUser,
  cache.set()
);
router.get(
  '/:login/hotmap',
  share.githubEnable(),
  cache.get('user-hotmap', {
    params: ['login'],
    session: ['locale']
  }),
  GitHub.getUserHotmap,
  cache.set({
    expire: 21600 // 6 hours
  })
);

module.exports = router;
