
import koaRouter from 'koa-router'
import Resume from '../controllers/resume'
import session from '../controllers/helper/session'
import cache from '../controllers/helper/cache'
import check from '../controllers/helper/check'
import share from '../controllers/helper/share'

const router = new koaRouter({
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
  '/list',
  check.session(session.requiredSessions),
  Resume.getResumeList
)

router.post(
  '/new',
  check.session(session.requiredSessions),
  Resume.createNewResume
)

router.post(
  '/default',
  check.session(session.requiredSessions),
  check.body('resumeId'),
  Resume.setDefaultResume
)

router.delete(
  '/:resumeId',
  check.session(session.requiredSessions),
  Resume.deleteResume
)

router.delete(
  '/',
  check.session(session.requiredSessions),
  Resume.deleteResume
)

router.post(
  '/rename',
  check.session(session.requiredSessions),
  check.body('resumeId'),
  check.body('title'),
  Resume.renameResume
)

router.post(
  '/copy',
  check.session(session.requiredSessions),
  check.body('resumeId'),
  Resume.copyResume
)

router.post(
  '/share',
  check.session(session.requiredSessions),
  check.body('resumeId'),
  Resume.toggleResumeShare
)

router.get(
  '/shared/public',
  check.query('hash'),
  share.resumeApiEnable(),
  cache.get('resume', {
    keys: ['query.hash', 'query.locale']
  }),
  Resume.getResumeByHash,
  cache.set({
    expire: 1800 // 0.5h
  })
)

module.exports = router
