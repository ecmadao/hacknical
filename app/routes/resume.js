import koaRouter from 'koa-router';
import Resume from '../controllers/resume';
import user from '../controllers/helper/user';
import session from '../controllers/helper/session';
import platform from '../controllers/helper/platform';
import cache from '../controllers/helper/cache';

const router = koaRouter({
  prefix: '/resume'
});

router.get('/edit',
  user.checkSession(session.requiredSessions),
  Resume.getResume
);
router.post('/edit', Resume.setResume);

router.get('/:hash',
  Resume.getPubResumePage
);

router.get('/:hash/pub',
  Resume.getPubResume
);

module.exports = router;
