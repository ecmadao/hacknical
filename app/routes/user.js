import koaRouter from 'koa-router';
import user from '../controllers/user';
import userHelper from '../middlewares/user_helper';

const router = koaRouter({
  prefix: '/user'
});

router.get('/dashboard', user.dashboard);
router.get('/login', user.login);

module.exports = router;
