
import getMongo from '../utils/database';
import logger from '../utils/logger';

export const initIndex = async () => {
  const db = await getMongo();

  try {
    db.collection('records').createIndex(
      { type: 1, login: 1 }
    );
    logger.info('[INDEX] records index created');
  } catch (e) {
    logger.error(e);
  }
};
