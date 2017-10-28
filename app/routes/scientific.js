import koaRouter from 'koa-router';
import Scientific from '../controllers/scientific';
import cache from '../controllers/helper/cache';
import check from '../controllers/helper/check';
import share from '../controllers/helper/share';

const router = koaRouter({
  prefix: '/scientific'
});

router.get(
  '/:login/statistic',
  share.githubEnable(),
  cache.get('user-statistic', {
    params: ['login']
  }),
  Scientific.getUserStatistic,
  cache.set()
);

router.get(
  '/:login/predictions',
  share.githubEnable(),
  Scientific.getUserPredictions
);

router.put(
  '/:login/predictions',
  share.githubEnable(),
  check.body('fullName', 'liked'),
  Scientific.putPredictionFeedback
);

module.exports = router;
