import fs from 'fs';
import path from 'path';
import koaRouter from 'koa-router';
import Home from '../controllers/home';
import platform from '../controllers/helper/platform';
import user from '../controllers/helper/user';

const router = koaRouter();
const basename = path.basename(module.filename);

fs.readdirSync(__dirname)
  .filter(file =>
    (file.indexOf('.') !== 0) && (file.split('.').slice(-1)[0] ===  'js') && (file !== basename)
  )
  .forEach(file => {
    const route = require(path.join(__dirname, file));
    router.use(route.routes(), route.allowedMethods());
  });

router.get('/', Home.index);
router.get('/404', Home.handle404);
router.get(
  '/dashboard',
  user.checkIfLogin(),
  platform.checkPlatform,
  Home.dashboard
);
router.get(
  '/initial',
  Home.initial
);

export default router;
