
import dateHelper from 'UTILS/date'
import objectAssign from 'UTILS/object-assign'

const byDateSeconds = dateHelper.date.bySeconds

const BASE_STOCK_CONFIG = {
  credits: { enabled: false },
  legend: { enabled: false },
  chart: {
    alignTicks: false,
    animation: false,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    events: {}
  },
  tooltip: {
    useHTML: true,
    shared: true,
    crosshairs: true,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 0,
    borderRadius: 8,
    headerFormat: '',
    shadow: false,
  },
  navigator: {
    maskFill: 'rgba(230, 230, 230, 0.75)',
    series: {
      color: '#cccccc',
      fillOpacity: 0.05
    },
    height: 70,
    xAxis: {
      labels: {
        formatter() {
          return byDateSeconds(this.value)
        }
      }
    },
  },
  rangeSelector: {
    buttonPosition: { x: -100, y: -100 },
    inputEnabled: false,
  },
  title: { text: '' },
  scrollbar: {
    enabled: true,
    barBackgroundColor: 'transparent',
    barBorderColor: 'transparent',
    buttonArrowColor: 'transparent',
    buttonBackgroundColor: 'transparent',
    buttonBorderColor: 'transparent',
    rifleColor: 'transparent',
    trackBackgroundColor: 'transparent',
    trackBorderColor: 'transparent',
    height: 0
  },
  xAxis: [{
    categories: [],
    crosshair: {
      width: 1,
      color: 'rgba(0,0,0,0.05)',
    },
    tickLength: 0,
    tickWidth: 1,
    labels: {
      autoRotation: true,
      formatter() {
        return byDateSeconds(this.value)
      }
    },
    lineWidth: 0,
    events: {},
    min: null,
    max: null,
  }],
  yAxis: [],
  series: []
}

const PV_STOCK_CONFIG = {
  plotOptions: {
    areaspline: {
      color: 'rgba(158, 170, 179, 0.7)',
      fillOpacity: 0.3,
    }
  },
  yAxis: [
    {
      id: 'pv',
      title: {
        text: '',
      },
      gridLineWidth: 0,
    },
  ],
  series: [
    {
      yAxis: 'pv',
      type: 'areaspline',
      name: 'page view',
      animation: true,
      data: [],
      groupPadding: 0,
      dataLabels: {
        enabled: false
      },
      labels: {
        enabled: false
      },
      marker: {
        enabled: true,
        radius: 3
      },
      showInNavigator: true,
      borderRadiusTopLeft: 4,
      borderRadiusTopRight: 4,
    },
  ]
}

const COMMITS_STOCK_CONFIG = {
  plotOptions: {
    areaspline: {
      color: 'rgba(55, 178, 77, 0.7)',
      fillOpacity: 0.3,
    }
  },
  yAxis: [
    {
      id: 'commits',
      title: {
        text: '',
      },
      gridLineWidth: 0,
    },
  ],
  series: [
    {
      yAxis: 'commits',
      type: 'areaspline',
      name: 'commits',
      animation: true,
      data: [],
      groupPadding: 0,
      dataLabels: {
        enabled: false
      },
      labels: {
        enabled: false
      },
      marker: {
        enabled: true,
        radius: 3
      },
      showInNavigator: true,
      borderRadiusTopLeft: 4,
      borderRadiusTopRight: 4,
    }
  ]
}

const getTooltipFormatter = (dateFormat, name) => function formatter() {
  const date = byDateSeconds(this.x, dateFormat)
  const val = this.points[0].y
  return `
    <div style="color: white;">
      ${date}<br/>
      <div style="color: white;">${name}: ${val}</div>
    </div>
  `
}

const getLabelFormatter = (dateFormat = 'YYYY/MM/DD') => function formatter() {
  return byDateSeconds(this.value, dateFormat)
}

export const getPVStockConfig = (options) => {
  const {
    pageViews,
    dateFormat
  } = options

  const seriesData = pageViews.map((pageView) => {
    const { count, seconds } = pageView
    return [seconds, count]
  })
  const config = objectAssign(
    {},
    BASE_STOCK_CONFIG,
    PV_STOCK_CONFIG
  )
  config.series[0].data = seriesData
  config.xAxis[0].labels.formatter = getLabelFormatter()

  if (pageViews.length) {
    const timestampTo = pageViews[pageViews.length - 1].seconds
    config.xAxis[0].max = timestampTo
    config.xAxis[0].min = timestampTo - (30 * 24 * 60 * 60)
  }

  config.tooltip.formatter = getTooltipFormatter(dateFormat, 'Page view')
  return config
}

export const getCommitsStockConfig = (options) => {
  const {
    dateFormat,
    commitsData
  } = options

  commitsData.sort((pre, next) => pre.seconds - next.seconds)
  const seriesData = commitsData.map((item) => {
    const { commits, seconds } = item
    return [seconds, commits]
  })

  const config = objectAssign(
    {},
    BASE_STOCK_CONFIG,
    COMMITS_STOCK_CONFIG
  )
  config.series[0].data = seriesData
  config.xAxis[0].labels.formatter = getLabelFormatter()

  if (commitsData.length) {
    const timestampTo = commitsData[commitsData.length - 1].seconds
    config.xAxis[0].max = timestampTo
    config.xAxis[0].min = timestampTo - (30 * 24 * 60 * 60)
  }

  config.tooltip.formatter = getTooltipFormatter(dateFormat, 'Commits')
  return config
}
