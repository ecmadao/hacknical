import koaRouter from 'koa-router';
import Github from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import session from '../controllers/helper/session';
import query from '../controllers/helper/query';
import platform from '../controllers/helper/platform';
import analyse from '../controllers/helper/analyse';

const router = koaRouter({
  prefix: '/github'
});

// zen & octocat
router.get(
  '/zen',
  Github.getZen
);
router.get(
  '/octocat',
  Github.getOctocat
);

// repos
router.get(
  '/repos',
  cache.get('repos', {
    query: ['login'],
    session: ['githubLogin']
  }),
  Github.getUserRepos,
  cache.set()
);
// orgs
router.get(
  '/orgs',
  cache.get('orgs', {
    query: ['login'],
    session: ['githubLogin']
  }),
  Github.getUserOrgs,
  cache.set()
);
router.get(
  '/shareRecords',
  user.checkSession(['userId', 'githubLogin']),
  Github.getStareRecords
);
router.get(
  '/updateTime',
  user.checkSession(['userId', 'githubLogin']),
  Github.getUpdateTime
);

// refresh github datas
router.get(
  '/refresh',
  user.checkSession(['userId', 'githubLogin']),
  Github.refreshDatas,
  cache.del()
);

router.get(
  '/user',
  user.checkSession(['userId']),
  cache.get('user', {
    session: ['githubLogin']
  }),
  Github.getUser,
  cache.set()
);

router.post(
  '/user/toggleShare',
  user.checkSession(['userId', 'githubLogin']),
  Github.toggleShare,
);

router.get(
  '/:login',
  platform.checkPlatform,
  analyse.collect,
  Github.sharePage
);
router.get(
  '/:login/user',
  cache.get('sharedUser', {
    params: ['login']
  }),
  Github.getSharedUser,
  cache.set()
);



module.exports = router;
