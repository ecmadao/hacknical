import koaRouter from 'koa-router';
import User from '../controllers/user';
import user from '../controllers/helper/user';

const router = koaRouter({
  prefix: '/user'
});

// dashboard
router.get('/dashboard', User.dashboard);
router.get('/resume', User.getResume);
router.post('/resume', User.setResume);

// user login/logout/signup
router.get('/login', User.loginPage);
router.get('/login/github', User.githubLogin);
router.post('/login', User.login);
router.post('/signup', User.signup);
router.get('/logout', User.logout);


module.exports = router;
