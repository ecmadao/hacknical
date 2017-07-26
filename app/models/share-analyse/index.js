import ShareAnalyse from './schema';
import dateHelper, { getValidateDate } from '../../utils/date';

const findShare = async options =>
  await ShareAnalyse.findOne(options);

const findShares = async options =>
  await ShareAnalyse.find(options);

const createShare = async (options) => {
  const findResult = await findShare(options);
  if (findResult) {
    return Promise.resolve({
      success: true
    });
  }
  const { login, userId, url } = options;
  await ShareAnalyse.create({
    login,
    userId,
    url,
    pageViews: []
  });
};

const disableShare = async (url) => {
  await changeShareStatus({
    url,
    enable: false
  });
};

const enableShare = async (url) => {
  await changeShareStatus({
    url,
    enable: true
  });
};

const changeShareStatus = async (options) => {
  const { enable, url } = options;
  const analyse = await findShare({ url });
  analyse.enable = enable;
  await analyse.save();
  return Promise.resolve(true);
};

const checkShareEnable = async (options) => {
  const analyse = await findShare(options);
  return Promise.resolve({
    success: analyse && analyse.enable
  });
};

const updateViewData = async (options) => {
  const { url, platform, from, browser } = options;
  const analyse = await findShare({ url });
  const { viewDevices, viewSources } = analyse;
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
  await analyse.save();
  return Promise.resolve({
    success: true
  });
};

const updateShare = async (options) => {
  const analyse = await findShare(options);
  if (!analyse) {
    return Promise.resolve({
      success: false
    });
  }
  if (!analyse.enable) {
    return Promise.resolve({
      success: false,
    });
  }
  const { pageViews } = analyse;
  const dateNow = dateHelper.getDateNow();
  const hourNow = dateHelper.getHourNow();
  const date = `${dateNow} ${hourNow}:00`;
  const targetPageViews = pageViews.filter(pageView => getValidateDate(pageView.date) === date);
  if (!targetPageViews.length) {
    analyse.pageViews.push({
      count: 1,
      date: dateHelper.getFormatData()
    });
  } else {
    targetPageViews[0].count += 1;
  }
  await analyse.save();
  return Promise.resolve({
    success: true
  });
};

const findAll = async () => await ShareAnalyse.find({});

export default {
  disableShare,
  enableShare,
  createShare,
  updateShare,
  updateViewData,
  checkShareEnable,
  changeShareStatus,
  findAll,
  find: findShares,
  findOne: findShare,
};
