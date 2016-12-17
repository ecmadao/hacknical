import fs from 'fs';
import path from 'path';
import koaRouter from 'koa-router';
import home from '../controllers/home';

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

router.get('/', home.index);

export default router;
