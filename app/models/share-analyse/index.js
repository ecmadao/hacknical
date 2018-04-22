import ShareAnalyse from './schema';
import dateHelper, { getValidateDate } from '../../utils/date';

const findShare = async (options = {}) =>
  await ShareAnalyse.findOne(options);

const findShares = async (options = {}) =>
  await ShareAnalyse.find(options);

const createShare = async (options) => {
  const { login, type } = options;
  const findResult = await findShare({ login, type });
  if (findResult) {
    return { success: true };
  }
  await ShareAnalyse.create(options);
};

const updateViewData = async (options) => {
  const {
    type,
    from,
    login,
    browser,
    platform,
  } = options;
  const analyse = await findShare({ type, login });
  if (!analyse && login) {
    await createShare({
      type,
      login,
      viewDevices: [{
        platform,
        count: 1
      }],
      viewSources: [{
        from,
        browser,
        count: 1
      }],
      pageViews: [{
        count: 1,
        date: dateHelper.getFormatData()
      }]
    });
  } else {
    const { viewDevices, viewSources, pageViews } = analyse;
    const targetDevices = viewDevices.filter(device => device.platform === platform);
    if (!targetDevices.length) {
      viewDevices.push({
        platform,
        count: 1
      });
    } else {
      targetDevices[0].count += 1;
    }

    const targetSources = viewSources.filter(
      source => source.browser === browser && source.from === from
    );
    if (!targetSources.length) {
      viewSources.push({
        from,
        browser,
        count: 1
      });
    } else {
      targetSources[0].count += 1;
    }

    const dateNow = dateHelper.getDateNow();
    const hourNow = dateHelper.getHourNow();
    const date = `${dateNow} ${hourNow}:00`;
    const targetPageViews = pageViews.filter(pageView => getValidateDate(pageView.date) === date);
    if (!targetPageViews.length) {
      pageViews.push({
        count: 1,
        date: dateHelper.getFormatData()
      });
    } else {
      targetPageViews[0].count += 1;
    }
    await analyse.save();
  }
  return { success: true };
};

const findAll = async () => await ShareAnalyse.find({});

export default {
  createShare,
  updateViewData,
  findAll,
  find: findShares,
  findOne: findShare,
};
