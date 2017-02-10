import koaRouter from 'koa-router';
import Resume from '../controllers/resume';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';
import platform from '../controllers/helper/platform';
import cache from '../controllers/helper/cache';
import analyse from '../controllers/helper/analyse';

const router = koaRouter({
  prefix: '/resume'
});

router.get('/edit',
  user.checkSession(session.requiredSessions),
  Resume.getResume
);
router.post('/edit', Resume.setResume);

router.get('/status',
  user.checkSession(session.requiredSessions),
  Resume.getResumeStatus
);
router.post('/status',
  user.checkSession(session.requiredSessions),
  Resume.setResumeStatus
);

router.get('/:hash',
  platform.checkPlatform,
  analyse.collectResumeData,
  Resume.getPubResumePage
);

router.get('/:hash/pub',
  Resume.getPubResume
);

module.exports = router;
