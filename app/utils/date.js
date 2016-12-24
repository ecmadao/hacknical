import moment from 'moment';
moment.locale('zh-cn');

const formatDate = (date) => (format) => moment(date).format(format);
const getSeconds = (date) => parseInt(formatDate(date)('X'));

export default {
  getSeconds,
  getDateAfterDays: (days) => moment().add(parseInt(days), 'days').format('L'),
  getDateBeforeYears: (years) => moment().add(-parseInt(years), 'years').format('L')
}
