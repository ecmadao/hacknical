import moment from 'moment';
moment.locale('zh-cn');

const formatDate = (date) => (format) => moment(date).format(format);
const getSeconds = (date) => parseInt(formatDate(date)('X'));

export const {
  getSeconds,
  getDateAfterDays: (days) => moment().add(parseInt(days), 'days').format('L'),
}
