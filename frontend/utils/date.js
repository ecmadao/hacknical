import moment from 'moment';
moment.locale('zh-cn');

const formatDate = (date) => (format) => moment(date).format(format);
const getSeconds = (date) => parseInt(formatDate(date)('X'));
const getDateBeforeYears = (before) => moment().add(-parseInt(before), 'years').format('YYYY.MM.DD')
const getDateAfterYears = (after) => moment().add(parseInt(after), 'years').format('YYYY.MM.DD')

export default {
  validator: {
    full: (date) => formatDate(date)(), // 2017-01-21T22:23:56+08:00
    fullFormat: (date) => formatDate(date)('YYYY.MM.DD HH:mm:ss'), // 2017.01.21 22:23:56
    fullDate: (date) => formatDate(date)('YYYY.MM.DD'), // 2017.01.21
    fullDateBySeconds: (seconds) => moment.unix(seconds).format(),
    date: (date) => formatDate(date)('YYYY.MM'), // 2017.01
    hour: (date) => formatDate(date)('HH') // 22
  },
  seconds: {
    beforeYears: (before) => {
      const date = getDateBeforeYears(before);
      return getSeconds(date);
    },
    afterYears: (after) => {
      const date = getDateAfterYears(after);
      return getSeconds(date);
    },
    getByDate: (date) => getSeconds(date),
    getCurrent: () => getSeconds()
  },
  date: {
    beforeYears: getDateBeforeYears,
    afterYears: getDateAfterYears,
    afterDays: (after, date = null) => moment(date).add(parseInt(after), 'days').format('YYYY.MM.DD'),
    bySeconds: (seconds) => moment.unix(seconds).format('YYYY.MM.DD')
  },
  relative: {
    hoursBefore: (date) => moment(date).startOf('hour').fromNow(),
    minutesBefore: (date) => moment(date).startOf('minute').fromNow(),
    secondsBefore: (date) => moment(date).startOf('second').fromNow(),
  }
}
