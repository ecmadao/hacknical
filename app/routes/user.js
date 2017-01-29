import koaRouter from 'koa-router';
import User from '../controllers/user';
import platform from '../controllers/helper/platform';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';

const router = koaRouter({
  prefix: '/user'
});

// dashboard
router.get('/dashboard',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.dashboard
);
// mobile dashboard
router.get('/analysis',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileAnalysis
);
router.get('/setting',
  platform.checkPlatform,
  user.checkIfLogin(),
  User.mobileSetting
);

router.get('/resume',
  user.checkSession(session.requiredSessions),
  User.getResume
);
router.post('/resume', User.setResume);

// user login/logout/signup
router.get('/login',
  platform.checkPlatform,
  user.checkIfNotLogin(),
  User.loginPage
);
router.get('/login/github', User.githubLogin);
router.post('/login', User.login);
router.post('/signup', User.signup);
router.get('/logout', User.logout);


module.exports = router;
