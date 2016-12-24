import koaRouter from 'koa-router';
import Github from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';

const router = koaRouter({
  prefix: '/github'
});

// repos
router.get(
  '/repos',
  user.checkSession(['userId', 'githubToken', 'githubLogin']),
  cache.get('repos'),
  Github.getRepos,
  cache.set()
);
router.get(
  '/repos/:reposName',
  user.checkSession(['userId', 'githubToken', 'githubLogin']),
  Github.getRepository
);
router.get(
  '/user',
  user.checkSession(['userId']),
  Github.getUser
);
router.get(
  '/repos/commits',
  user.checkSession(['userId', 'githubToken', 'githubLogin']),
  cache.get('commits'),
  Github.getCommits,
  cache.set()
);
router.get(
  '/repos/:reposName/commits',
  user.checkSession(['userId', 'githubToken', 'githubLogin']),
  Github.getRepositoryCommits
);


module.exports = router;
