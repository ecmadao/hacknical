
import objectAssign from 'UTILS/object-assign'
import dateHelper from 'UTILS/date'

const formatHotmap = (hotmap) => {
  if (!hotmap || !hotmap.datas) return null

  const now = dateHelper.validator.fullDate()
  const { datas } = hotmap
  const result = {}
  const streak = {
    longest: {
      count: 0,
      start: null,
      end: null,
    },
    current: {
      count: 0,
      start: null,
      end: null,
    },
    daily: {
      count: 0,
      date: null
    },
    weekly: {
      count: 0,
      start: null,
      end: null,
    },
  }
  const levelRange = {
    0: {
      sum: 0,
      count: 1
    },
    1: null,
    2: null,
    3: null,
    4: null,
  }
  let total = 0
  let start = null
  let end = null
  let weekTmp = {
    count: 0,
    start: null,
    end: null,
  }
  const tmp = new Set()

  for (let i = 0; i < datas.length; i += 1) {
    const item = datas[i]
    const { data, date, level } = item
    if (tmp.has(date)) continue
    tmp.add(date)
    result[new Date(date).getTime() / 1000] = data

    if (!streak.daily.date || data > streak.daily.count) {
      streak.daily = {
        date,
        count: data
      }
    }

    const dayOfWeek = dateHelper.date.dayOfWeek(date)
    if (dayOfWeek === '0') {
      if (weekTmp.count > streak.weekly.count) {
        streak.weekly = objectAssign({}, weekTmp)
      }
      weekTmp = {
        count: 0,
        start: null,
        end: null
      }
    }
    weekTmp.count += data
    if (!weekTmp.start) weekTmp.start = date
    weekTmp.end = date

    if (level !== 0) {
      if (!levelRange[level]) {
        levelRange[level] = {
          sum: 0,
          count: 0,
        }
      }
      levelRange[level].sum += data
      levelRange[level].count += 1
    }

    if (date <= now) {
      if (data === 0) {
        if (streak.longest.count < streak.current.count) {
          streak.longest = objectAssign({}, streak.current)
        }
        streak.current.count = 0
      } else {
        streak.current.count += 1
      }
      if (!streak.current.start) streak.current.start = date
      streak.current.end = date
    }
    if (i === 0) start = date
    end = date
    total += data
  }
  if (streak.longest.count < streak.current.count) {
    streak.longest = objectAssign({}, streak.current)
  }
  return {
    end,
    start,
    total,
    streak,
    datas: result,
    levelRanges: Object.keys(levelRange)
      .filter(l => !!levelRange[l])
      .map(l => Math.ceil(levelRange[l].sum / levelRange[l].count)),
  }
}

export default formatHotmap
