
import koaRouter from 'koa-router'
import Scientific from '../controllers/scientific'
import cache from '../controllers/helper/cache'
import check from '../controllers/helper/check'
import share from '../controllers/helper/share'

const router = koaRouter({
  prefix: '/api/scientific'
})

router.get(
  '/:login/statistic',
  share.githubEnable(),
  cache.get('github-starred-statistic', {
    params: ['login']
  }),
  Scientific.getUserStatistic,
  cache.set({
    expire: 86400 // 24 hours
  })
)

router.get(
  '/:login/predictions',
  share.githubEnable(),
  cache.get('github-repositories-predictions', {
    params: ['login']
  }),
  Scientific.getUserPredictions,
  cache.set()
)

router.delete(
  '/:login/predictions',
  share.githubEnable(),
  check.body('fullName'),
  Scientific.removePrediction,
  cache.del()
)

router.put(
  '/:login/predictions',
  share.githubEnable(),
  check.body('fullName', 'liked'),
  Scientific.putPredictionFeedback,
  cache.del()
)

module.exports = router
