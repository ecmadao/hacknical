
import path from 'path';
import logger from '../../utils/logger';
import { shadowImport } from '../../utils/loader';

const PREFIX = __dirname.split('/').slice(-1)[0];
const DELIVER = shadowImport(path.join(__dirname, 'lib'), {
  prefix: PREFIX,
  excludes: ['shared.js']
});

const send = (Deliver, options) => {
  const { mq, data } = options;
  process.nextTick(async () => {
    try {
      await new Deliver(mq).send(data);
    } catch (e) {
      logger.error(e);
    }
  });
};

const handler = {
  get(_, name) {
    const key = `${PREFIX}.${name}`;
    if (!DELIVER[Symbol.for(key)]) {
      throw new Error(`[INVALIDATE METHOD] unknown source ${name}`);
    }

    const Deliver = DELIVER[Symbol.for(key)];

    return options => send(Deliver, options);
  }
};

function target() {}
const SenderFactory = new Proxy(target, handler);

export default SenderFactory;
