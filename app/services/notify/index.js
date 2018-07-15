
import path from 'path';
import { shadowImport } from '../../utils/loader';

const PREFIX = 'notify';
const DELIVER = shadowImport(path.join(__dirname, 'lib'), {
  prefix: PREFIX,
  excludes: ['shared.js']
});

const send = Deliver => (options) => {
  const { mq, data } = options;
  process.nextTick(async () => {
    await new Deliver(mq).send(data);
  });
};

const notify = (source) => {
  const Deliver = DELIVER[Symbol.for(`${PREFIX}.${source}`)];
  if (!Deliver) throw new Error(`Can not find target source: ${source}`);

  return {
    send: send(Deliver),
  };
};

export default notify;
