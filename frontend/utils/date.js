import moment from 'moment';
import { formatLocale } from 'LOCALES';

const locale = formatLocale();
moment.locale(locale);

const formatDate = (format) => (date) => moment(date).format(format);
const getSeconds = (date) => parseInt(formatDate('X')(date));
const getDateBeforeYears = (format) => (before) => moment().add(-parseInt(before), 'years').format(format)
const getDateAfterYears = (format) => (after) => moment().add(parseInt(after), 'years').format(format)

export default {
  validator: {
    full: (date) => formatDate()(date), // 2017-01-21T22:23:56+08:00
    fullFormat: (date) =>
      formatDate('YYYY-MM-DD HH:mm:ss')(date), // 2017.01.21 22:23:56
    fullDate: (date) => formatDate('YYYY-MM-DD')(date), // 2017.01.21
    fullDateBySeconds: (seconds) => moment.unix(seconds).format(),
    date: (date) => formatDate('YYYY-MM')(date), // 2017.01
    hour: (date) => formatDate('HH')(date) // 22
  },
  seconds: {
    beforeYears: (before) => {
      const date = getDateBeforeYears()(before);
      return getSeconds(date);
    },
    afterYears: (after) => {
      const date = getDateAfterYears()(after);
      return getSeconds(date);
    },
    getByDate: (date) => getSeconds(date),
    getCurrent: () => getSeconds()
  },
  date: {
    now: () => formatDate('YYYY-MM-DD')(),
    beforeYears: getDateBeforeYears('YYYY-MM-DD'),
    afterYears: getDateAfterYears('YYYY-MM-DD'),
    afterDays: (after, date = null) =>
      moment(date).add(parseInt(after), 'days').format('YYYY-MM-DD'),
    bySeconds: (seconds, format = 'YYYY-MM-DD') =>
      moment.unix(seconds).format(format),
    getMonth: (date) => formatDate('M')(date)
  },
  relative: {
    hoursBefore: (date) => moment(date).startOf('hour').fromNow(),
    minutesBefore: (date) => moment(date).startOf('minute').fromNow(),
    secondsBefore: (date) => moment(date).startOf('second').fromNow(),
  }
}
