import koaRouter from 'koa-router';
import Resume from '../controllers/resume';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';
import cache from '../controllers/helper/cache';
import check from '../controllers/helper/check';
import record from '../controllers/helper/record';
import share from '../controllers/helper/share';

const router = koaRouter({
  prefix: '/resume'
});

router.get('/',
  user.checkSession(session.requiredSessions),
  Resume.getResume
);
router.put('/',
  user.checkSession(session.requiredSessions),
  check.body('resume'),
  Resume.setResume,
  cache.del()
);
router.patch('/',
  user.checkSession(session.requiredSessions),
  check.body('data'),
  Resume.patchResume,
  cache.del()
);

router.get('/download',
  user.checkSession(session.requiredSessions),
  Resume.downloadResume
);

router.get('/records',
  user.checkSession(session.requiredSessions),
  Resume.getShareRecords
);

router.get('/info',
  Resume.getResumeInfo
);
router.patch('/info',
  user.checkSession(session.requiredSessions),
  check.body('info'),
  Resume.setResumeInfo,
);
router.patch('/reminder',
  user.checkSession(session.requiredSessions),
  check.body('reminder'),
  Resume.setResumeReminder,
);

router.get('/shared/public',
  check.query('hash'),
  cache.get('resume', {
    keys: ['query.hash']
  }),
  Resume.getResumeByHash,
  cache.set()
);

router.get('/:hash',
  share.resumeEnable('params.hash'),
  record.resume('params.hash'),
  Resume.resumePage
);

module.exports = router;
