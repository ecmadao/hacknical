
import dateHelper from '../utils/date';

const ensure = async (col, query) => {
  await col.findAndModify(
    query,
    [],
    {
      $setOnInsert: {
        total: 0,
        pageViews: [],
        viewDevices: [],
        viewSources: []
      }
    },
    {
      new: true,
      upsert: true,
    }
  );
};

const updateOrInsert = async (col, options) => {
  const {
    baseQuery,
    insertQuery,
    insertExec,
    updateQuery,
    updateExec,
  } = options;

  const res = await col.updateOne(
    Object.assign({}, baseQuery, insertQuery),
    insertExec
  );
  if (res.matchedCount !== 1) {
    await col.updateOne(
      Object.assign({}, baseQuery, updateQuery),
      updateExec
    );
  }
};

const updateRecords = async (db, options) => {
  const recordCol = db.collection('records');

  const {
    type,
    login,
    platform,
    count = 1,
    from = '',
    browser = '',
  } = options;
  const query = { type, login };

  await ensure(recordCol, query);

  const dateNow = dateHelper.getDateNow();
  const hourNow = dateHelper.getHourNow();
  const date = `${dateNow}T${hourNow}:00:00`;

  // pageViews
  await updateOrInsert(recordCol, {
    baseQuery: query,
    insertQuery: { 'pageViews.date': { $ne: date } },
    insertExec: {
      $addToSet: {
        pageViews: {
          date,
          count
        }
      },
      $inc: {
        total: count
      }
    },
    updateQuery: { 'pageViews.date': date },
    updateExec: {
      $inc: {
        'pageViews.$.count': count,
        total: count
      }
    }
  });

  // viewDevices
  await updateOrInsert(recordCol, {
    baseQuery: query,
    insertQuery: { 'viewDevices.platform': { $ne: platform } },
    insertExec: {
      $addToSet: {
        viewDevices: {
          count,
          platform,
        }
      },
    },
    updateQuery: { 'viewDevices.platform': platform },
    updateExec: {
      $inc: {
        'viewDevices.$.count': count,
      }
    }
  });

  // viewSources
  await updateOrInsert(recordCol, {
    baseQuery: query,
    insertQuery: {
      'viewSources.browser': { $ne: browser },
      'viewSources.from': { $ne: from }
    },
    insertExec: {
      $addToSet: {
        viewSources: {
          from,
          count,
          browser,
        }
      },
    },
    updateQuery: {
      'viewSources.browser': browser,
      'viewSources.from': from
    },
    updateExec: {
      $inc: {
        'viewSources.$.count': count,
      }
    }
  });
};

const getRecords = async (db, options) => {
  const {
    type,
    login,
  } = options;

  const recordCol = db.collection('records');
  const results = await recordCol.find({
    type,
    login,
  }).toArray();
  return results;
};

export default {
  getRecords,
  updateRecords
};
