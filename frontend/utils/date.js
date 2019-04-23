
import moment from 'moment'
import { formatLocale } from 'LOCALES'

const locale = formatLocale()
moment.locale(locale)

const validateDate = (rawDate) => {
  const date = `${rawDate}`
  let separator = '-'
  let dates = date.split(separator)
  if (!dates.length) {
    separator = '/'
    dates = date.split(separator)
  }
  if (!dates.length) return rawDate

  const result = [dates[0]]
  for (let i = 1; i <= 2; i += 1) {
    let num = dates[i]
    if (!num) num = '01'
    if (num.length < 2) num = `0${num}`
    result.push(num)
  }
  result.push(...dates.slice(3))
  return result.join(separator)
}

const formatDate = format => date => moment(date).format(format)
const getSeconds = date => parseInt(formatDate('X')(validateDate(date)), 10)

const getDateRelativeX = (unit, pn = 1) => format => (before, date) =>
  moment(date).add(pn * parseInt(before, 10), unit).format(format)
const getDateBeforeYears = getDateRelativeX('years', -1)
const getDateAfterYears = getDateRelativeX('years')
const getDateBeforeMonths = getDateRelativeX('months', -1)

export default {
  validator: {
    full: date => formatDate()(date), // 2017-01-21T22:23:56+08:00
    fullFormat: date =>
      formatDate('YYYY-MM-DD HH:mm:ss')(date), // 2017.01.21 22:23:56
    fullDate: date => formatDate('YYYY-MM-DD')(date), // 2017.01.21
    fullDateBySeconds: seconds => moment.unix(seconds).format(),
    date: date => formatDate('YYYY-MM')(date), // 2017.01
    hour: date => formatDate('HH')(date), // 22
    format: (date, format) => formatDate(format)(date)
  },
  seconds: {
    beforeYears: (before) => {
      const date = getDateBeforeYears()(before)
      return getSeconds(date)
    },
    afterYears: (after) => {
      const date = getDateAfterYears()(after)
      return getSeconds(date)
    },
    getByDate: date => getSeconds(date),
    getCurrent: () => getSeconds()
  },
  date: {
    now: () => formatDate('YYYY-MM-DD')(),
    beforeYears: getDateBeforeYears('YYYY-MM-DD'),
    beforeMonths: getDateBeforeMonths('YYYY-MM-DD'),
    afterYears: getDateAfterYears('YYYY-MM-DD'),
    afterDays: (after, date) =>
      moment(date).add(parseInt(after, 10), 'days').format('YYYY-MM-DD'),
    bySeconds: (seconds, format = 'YYYY-MM-DD') =>
      moment.unix(seconds).format(format),
    getMonth: date => formatDate('M')(date),
    dayOfWeek: date => formatDate('e')(date),
  },
  relative: {
    hoursBefore: date => moment(date).startOf('hour').fromNow(),
    minutesBefore: date => moment(date).startOf('minute').fromNow(),
    secondsBefore: date => moment(date).startOf('second').fromNow(),
  }
}
