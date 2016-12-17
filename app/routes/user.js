import koaRouter from 'koa-router';
import user from '../controllers/user';
import userHelper from '../middlewares/user_helper';

const router = koaRouter({
  prefix: '/user'
});

// dashboard
router.get('/dashboard', user.dashboard);
router.get('/resume', user.getResume);
router.post('/resume', user.setResume);

// user login/logout/signup
router.get('/login', user.loginPage);
router.post('/login', user.login);
router.post('/signup', user.signup);
router.get('/logout', user.logout);

module.exports = router;
