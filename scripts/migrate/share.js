
import ShareAnalyse from '../../app/models/share-analyse';
import getMongo from '../../app/utils/database';
import UserAPI from '../../app/services/user';

const migrate = async () => {
  const datas = await ShareAnalyse.findAll();
  const db = await getMongo();
  const recordCol = db.collection('records');

  for (const data of datas) {
    const {
      url,
      userId,
      pageViews,
      viewDevices,
      viewSources
    } = data;

    let login = data.login;
    if (!login) {
      const userInfo = await UserAPI.getUser({ userId });
      login = userInfo.githubLogin || userInfo.githubInfo.login;
    }

    console.log(JSON.stringify(data));
    const type = /github/.test(url) ? 'github' : 'resume';
    const query = { login, type };

    await recordCol.findAndModify(
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

    // ========================== pageViews ==========================
    for (const pv of pageViews) {
      const res = await recordCol.updateOne(
        Object.assign({}, query, {
          'pageViews.date': { $ne : pv.date }
        }),
        {
          $addToSet: {
            pageViews: {
              date: pv.date,
              count: pv.count
            }
          },
          $inc: {
            total: pv.count
          }
        }
      );
      if (res.matchedCount !== 1) {
        await recordCol.updateOne(
          Object.assign({}, query, {
            'pageViews.date': pv.date
          }),
          {
            $inc : {
              "pageViews.$.count" : pv.count,
              total: pv.count
            }
          }
        );
      }
    }

    // ========================== viewDevices ==========================
    for (const vd of viewDevices) {
      const res = await recordCol.updateOne(
        Object.assign({}, query, {
          'viewDevices.platform': { $ne : vd.platform }
        }),
        {
          $addToSet: {
            viewDevices: {
              platform: vd.platform,
              count: vd.count
            }
          }
        }
      );
      if (res.matchedCount !== 1) {
        await recordCol.updateOne(
          Object.assign({}, query, {
            'viewDevices.platform': vd.platform
          }),
          {
            $inc : {
              "viewDevices.$.count" : vd.count,
            }
          }
        );
      }
    }

    // ========================== viewSources ==========================
    for (const vs of viewSources) {
      const res = await recordCol.updateOne(
        Object.assign({}, query, {
          'viewSources.browser': { $ne : vs.browser },
          'viewSources.from': { $ne : vs.from }
        }),
        {
          $addToSet: {
            viewSources: {
              browser: vs.browser,
              from: vs.from,
              count: vs.count
            }
          },
        }
      );
      if (res.matchedCount !== 1) {
        await recordCol.updateOne(
          Object.assign({}, query, {
            'viewSources.browser': vs.browser,
            'viewSources.from': vs.from
          }),
          {
            $inc : {
              "viewSources.$.count" : vs.count,
            }
          }
        );
      }
    }

  }

  process.exit();
};

migrate();
