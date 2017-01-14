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
  const viewDate = `${dateNow} ${hourNow}:00`;
  const targetPageViews = pageViews.filter(pageView => pageView.viewDate === viewDate);
  if (!targetPageViews.length) {
    analyse.pageViews.push({
      viewDate,
      viewCount: 1
    });
  } else {
    targetPageViews[0].viewCount += 1;
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
  checkShareEnable,
  changeShareStatus
}
