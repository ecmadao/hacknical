import moment from 'moment';
moment.locale('zh-cn');

// const formatDate = (format) => (date) => moment(date).format(format);
const formatDate = (date) => (format) => moment(date).format(format);
const getSeconds = (date) => parseInt(formatDate(date)('X'));

export const getDateBeforeYears = (before) => moment().add(-parseInt(before), 'years').format('L')
export const getDateAfterYears = (after) => moment().add(parseInt(after), 'years').format('L')

export const getSecondsBeforeYears = (before) => {
  const date = getDateBeforeYears(before);
  return getSeconds(date);
};
export const getSecondsAfterYears = (after) => {
  const date = getDateAfterYears(after);
  return getSeconds(date);
};

export const getRelativeTime = (date) => moment(date).startOf('hour').fromNow();

export const getValidateFullDate = (date) => formatDate(date)('L');

export const getDateBySeconds = (seconds) => moment.unix(seconds).format('L')
export const getSecondsByDate = (date) => getSeconds(date);

export const getCurrentDate = () => formatDate()('L');
export const getCurrentSeconds = () => getSecondsByDate();

export const sortByX = (key) => (thisObj, nextObj) => getSeconds(thisObj.key) - getSeconds(nextObj.key);

export const validateDate = (date) => getValidateFullDate(date).split('-').slice(0, 2).join('-');
