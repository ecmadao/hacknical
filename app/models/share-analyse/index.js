import ShareAnalyse from './schema';
import dateHelper from '../../utils/date';

const findShare = async (options) => {
  return await ShareAnalyse.findOne(options);
};

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

const disableShare = async (login, url) => {
  await changeShareStatus({
    login,
    url,
    enable: false
  });
};

const enableShare = async (login, url) => {
  await changeShareStatus({
    login,
    url,
    enable: true
  });
};

const changeShareStatus = async (options) => {
  const { login, enable, url } = options;
  const analyse = await findShare({ login, url });
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
  const { login, url, platform, from, browser } = options;
  const analyse = await findShare({ login, url });
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

  const targetSources = viewSources.filter(source => source.browser === browser && source.from === from);
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

const updateShare = async (login, url) => {
  const analyse = await findShare({ login, url });
  if (!analyse) {
    return Promise.resolve({
      success: false
    });
  }
  if (!analyse.enable) {
    return Promise.resolve({
      success: false,
      message: '该分享已被关闭'
    });
  }
  const { pageViews } = analyse;
  const dateNow = dateHelper.getDateNow();
  const hourNow = dateHelper.getHourNow();
  const date = `${dateNow} ${hourNow}:00`;
  const targetPageViews = pageViews.filter(pageView => pageView.date === date);
  if (!targetPageViews.length) {
    analyse.pageViews.push({
      date,
      count: 1
    });
  } else {
    targetPageViews[0].count += 1;
  }
  await analyse.save();
  return Promise.resolve({
    success: true
  });
};

export default {
  findShare,
  disableShare,
  enableShare,
  createShare,
  updateShare,
  updateViewData,
  checkShareEnable,
  changeShareStatus
}
