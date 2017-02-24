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
router.post('/edit',
  Resume.setResume,
  cache.del()
);


router.get('/status',
  Resume.getResumeStatus
);
router.post('/shareStatus',
  user.checkSession(session.requiredSessions),
  Resume.setResumeShareStatus
);
router.post('/githubStatus',
  user.checkSession(session.requiredSessions),
  Resume.setResumeGithubStatus
);
router.post('/githubSection',
  user.checkSession(session.requiredSessions),
  Resume.setGithubShareSection
);

router.get('/shareData',
  user.checkSession(session.requiredSessions),
  Resume.getShareData
);


router.get('/:hash',
  platform.checkPlatform,
  analyse.collectResumeData,
  Resume.getPubResumePage
);

router.get('/:hash/pub',
  cache.get('resume', {
    params: ['hash']
  }),
  Resume.getPubResume,
  cache.set()
);

module.exports = router;
