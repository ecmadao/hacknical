/* eslint global-require: "off", import/no-dynamic-require: "off", no-unsafe-finally: "off" */
import fs from 'fs';
import path from 'path';
import logger from '../../utils/logger';

const buildDeliver = folder =>
  fs.readdirSync(folder)
    .filter(file =>
      file !== 'shared.js' && fs.statSync(path.resolve(folder, file)).isFile()
    )
    .reduce((pre, cur) => {
      const filepath = path.resolve(folder, cur);
      const key = cur.split('.').slice(0, -1).join('.');
      try {
        const module = require(`${filepath}`).default;
        pre[key] = module;
      } catch (e) {
        logger.error(e);
      } finally {
        return pre;
      }
    }, {});

const DELIVER = buildDeliver(path.join(__dirname, 'lib'));

const send = Deliver => (options) => {
  const { mq, data } = options;
  process.nextTick(async () => {
    await new Deliver(mq).send(data);
  });
};

const notify = (source) => {
  const Deliver = DELIVER[source];
  if (!Deliver) throw new Error(`Can not find target source: ${source}`);

  return {
    send: send(Deliver),
  };
};

export default notify;
