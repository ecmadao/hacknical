
import network from '../../services/network'
import logger from '../../utils/logger'

export const getRecords = async (limit, query) => {
  let records = []
  try {
    records = await network.stat.getRecords(query)
  } catch (e) {
    logger.error(e)
  }

  const viewDevices = []
  const viewSources = []
  const pageViews = []
  let totalPV = 0

  for (const record of records) {
    viewDevices.push(...record.viewDevices)
    viewSources.push(...record.viewSources)
    pageViews.push(...record.pageViews)
    totalPV = record.pageViews.reduce(
      (num, pv) => {
        return Number.isNaN(pv.count) ? num : num + pv.count
      },
      totalPV
    )
  }

  return {
    totalPV,
    viewDevices,
    viewSources,
    pageViews: pageViews
      .filter(pv => !Number.isNaN(pv.count))
      .sort(
        (pv1, pv2) => new Date(pv1.date).getTime() - new Date(pv2.date).getTime()
      )
      .slice(pageViews.length - limit)
  }
}

export const getLogs = async (limit, query) => {
  const logs = await network.stat.getLogs({
    limit,
    qs: JSON.stringify(query)
  })

  return Object.values(
    logs.reduce((dict, log) => {
      const {
        _id,
        login,
        type,
        updatedAt,
        createdAt,
        ...others
      } = log
      if (!dict[others.ipInfo.ip]) {
        dict[others.ipInfo.ip] = {
          ip: others.ipInfo.ip,
          addr: others.ipInfo.addr,
          datetime: others.datetime,
          browser: others.browser,
          platform: others.platform,
          data: []
        }
      }
      dict[others.ipInfo.ip].data.push(others)
      return dict
    }, {})
  ).sort((log1, log2) => new Date(log2.datetime).getTime() - new Date(log1.datetime).getTime())
}
