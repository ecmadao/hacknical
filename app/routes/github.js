import koaRouter from 'koa-router';
import GitHub from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import query from '../controllers/helper/query';
import platform from '../controllers/helper/platform';
import analyse from '../controllers/helper/analyse';

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
  '/refresh',
  user.checkSession(['userId', 'githubLogin']),
  GitHub.refreshDatas,
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
  GitHub.toggleShare,
);

router.get(
  '/:login',
  platform.checkPlatform,
  analyse.collect,
  GitHub.sharePage
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
