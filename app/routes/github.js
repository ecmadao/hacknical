import koaRouter from 'koa-router';
import github from '../controllers/github';
import userHelper from '../middlewares/user_helper';

const router = koaRouter({
  prefix: '/github'
});

// repos
router.get('/repos', github.getRepos);
router.get('/repos/:reposName', github.getRepository);
router.get('/repos/:reposName/readme', github.getReadme);


module.exports = router;
