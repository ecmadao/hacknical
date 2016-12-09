import moment from 'moment';
moment.locale('zh-cn');

const formatDate = (format) => (date) => moment(date).format(format);

export const getDateBeforeYears = (before) => moment().add(-parseInt(before), 'years').calendar()

export const getRelativeTime = (date) => moment(date).startOf('hour').fromNow();

export const getUnixBeforeYears = (before) => {
  const date = getDateBeforeYears(before);
  return formatDate('x')(date);
};

export const getValidateFullDate = (date) => formatDate('L')(date);

export const getCurrentDate = () => formatDate('L')();
