import koaRouter from 'koa-router';
import Resume from '../controllers/resume';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';
import platform from '../controllers/helper/platform';
import cache from '../controllers/helper/cache';
import check from '../controllers/helper/check';
import analyse from '../controllers/helper/analyse';
import share from '../controllers/helper/share';

const router = koaRouter({
  prefix: '/resume'
});

router.get('/edit',
  user.checkSession(session.requiredSessions),
  Resume.getResume
);
router.put('/edit',
  user.checkSession(session.requiredSessions),
  check.body('resume'),
  Resume.setResume,
  cache.del()
);

router.get('/download',
  user.checkSession(session.requiredSessions),
  Resume.downloadResume
);

router.get('/pub',
  check.query('hash'),
  share.resumeEnable('query.hash'),
  cache.get('resume', {
    query: ['hash']
  }),
  Resume.getPubResume,
  cache.set()
);

router.get('/hash',
  check.query('login'),
  share.resumeEnableByLogin(),
  cache.get('resume-hash', {
    query: ['login']
  }),
  Resume.getPubResumeHash,
  cache.set()
);

router.get('/share',
  user.checkSession(session.requiredSessions),
  Resume.getResumeStatus
);

router.patch('/hireAvailable',
  user.checkSession(session.requiredSessions),
  check.body('hireAvailable'),
  Resume.setHireAvailable,
  cache.del()
);

router.get('/share/records',
  user.checkSession(session.requiredSessions),
  Resume.getShareRecords
);
router.patch('/share/status',
  user.checkSession(session.requiredSessions),
  check.body('enable'),
  Resume.setResumeShareStatus
);
router.patch('/share/template',
  user.checkSession(session.requiredSessions),
  check.body('template'),
  Resume.setResumeShareTemplate
);
router.patch('/share/github',
  user.checkSession(session.requiredSessions),
  check.body('enable'),
  Resume.setResumeGithubStatus
);
router.patch('/github/section',
  user.checkSession(session.requiredSessions),
  Resume.setGithubShareSection
);

router.get('/:hash',
  share.resumeEnable(),
  platform.setPlatform(),
  analyse.resumeByHash(),
  Resume.getPubResumePage
);

router.get('/:hash/share',
  share.resumeEnable(),
  Resume.getPubResumeStatus
);

module.exports = router;
