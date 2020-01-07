
import koaRouter from 'koa-router'
import Resume from '../controllers/resume'
import session from '../controllers/helper/session'
import cache from '../controllers/helper/cache'
import check from '../controllers/helper/check'

const router = koaRouter({
  prefix: '/api/resume'
})

router.get(
  '/data',
  check.session(session.requiredSessions),
  Resume.getResume
)
router.put(
  '/data',
  check.session(session.requiredSessions),
  check.body('resume'),
  Resume.setResume,
  cache.del()
)
router.get(
  '/image/upload',
  check.session(session.requiredSessions),
  check.query('filename'),
  Resume.getImageUploadUrl
)
router.get(
  '/school',
  check.query('school'),
  cache.get('school', {
    keys: ['query.school']
  }),
  Resume.getSchoolInfo,
  cache.set()
)

router.get(
  '/download',
  check.session(session.requiredSessions),
  Resume.downloadResume
)

router.get(
  '/records',
  check.session(session.requiredSessions),
  Resume.getShareRecords
)

router.get(
  '/logs',
  check.session(session.requiredSessions),
  Resume.getShareLogs
)

router.get(
  '/info',
  Resume.getResumeInfo
)
router.patch(
  '/info',
  check.session(session.requiredSessions),
  check.body('info'),
  Resume.setResumeInfo
)

router.get(
  '/shared/public',
  check.query('hash'),
  cache.get('resume', {
    keys: ['query.hash', 'query.locale']
  }),
  Resume.getResumeByHash,
  cache.set({
    expire: 1800 // 0.5h
  })
)

module.exports = router
