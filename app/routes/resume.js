
import koaRouter from 'koa-router'
import Resume from '../controllers/resume'
import session from '../controllers/helper/session'
import cache from '../controllers/helper/cache'
import check from '../controllers/helper/check'
import record from '../controllers/helper/record'
import share from '../controllers/helper/share'

const router = koaRouter({
  prefix: '/resume'
})

router.get('/',
  check.session(session.requiredSessions),
  Resume.getResume
)
router.put('/',
  check.session(session.requiredSessions),
  check.body('resume'),
  Resume.setResume,
  cache.del()
)
router.patch('/',
  check.session(session.requiredSessions),
  check.body('data'),
  Resume.patchResume,
  cache.del()
)

router.get('/download',
  check.session(session.requiredSessions),
  Resume.downloadResume
)

router.get('/records',
  check.session(session.requiredSessions),
  Resume.getShareRecords
)

router.get('/info',
  Resume.getResumeInfo
)
router.patch('/info',
  check.session(session.requiredSessions),
  check.body('info'),
  Resume.setResumeInfo
)
router.patch('/reminder',
  check.session(session.requiredSessions),
  check.body('reminder'),
  Resume.setResumeReminder
)

router.get('/shared/public',
  check.query('hash'),
  cache.get('resume', {
    keys: ['query.hash']
  }),
  Resume.getResumeByHash,
  cache.set()
)

router.get('/:hash',
  share.resumeEnable('params.hash'),
  record.resume('params.hash'),
  Resume.resumePage
)

module.exports = router
