import koaRouter from 'koa-router';
import User from '../controllers/user';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';

const router = koaRouter({
  prefix: '/user'
});

// dashboard
router.get('/dashboard',
  user.checkIfLogin(),
  User.dashboard
);
router.get('/resume',
  user.checkSession(session.requiredSessions),
  User.getResume
);
router.post('/resume', User.setResume);

// user login/logout/signup
router.get('/login',
  user.checkIfNotLogin(),
  User.loginPage
);
router.get('/login/github', User.githubLogin);
router.post('/login', User.login);
router.post('/signup', User.signup);
router.get('/logout', User.logout);


module.exports = router;
