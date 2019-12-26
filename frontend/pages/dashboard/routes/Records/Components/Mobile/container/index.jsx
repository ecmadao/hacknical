import React from 'react'
import Chart from 'chart.js'
import cx from 'classnames'
import deepcopy from 'deepcopy'
import { Loading } from 'light-ui'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import locales from 'LOCALES'
import github from 'UTILS/github'
import dateHelper from 'UTILS/date'
import Slick from 'COMPONENTS/Slick'
import objectAssign from 'UTILS/object-assign'
import sharedStyles from 'SHARED/styles/mobile.css'
import { RECORDS_SECTIONS } from 'UTILS/constant/records'
import { LINE_CONFIG, RADAR_CONFIG } from 'UTILS/constant/chart'
import styles from '../styles/records.css'
import recordsActions from '../../../redux/actions'

const sortByCount = github.sortByX({ key: 'count' })
const analysisTexts = locales('dashboard').records.common

class MobileRecords extends React.Component {
  constructor(props) {
    super(props)
    this.pageViewsChart = null
    this.viewDevicesChart = null
    this.viewSourcesChart = null
  }

  componentDidMount() {
    this.fetchRecordsData()
    this.fetchLogsData()
  }

  componentDidUpdate(preProps) {
    const { activeTab } = this.props
    if (activeTab !== preProps.activeTab) {
      this.reset()
      this.fetchRecordsData()
      this.fetchLogsData()
    }
    if (this.data.recordsLoading || !this.data.recordsFetched) return
    this.renderCharts()
  }

  fetchRecordsData() {
    const { actions, activeTab } = this.props
    actions.fetchRecordsData(activeTab)
  }

  fetchLogsData() {
    const { actions, activeTab } = this.props
    actions.fetchLogsData(activeTab)
  }

  reset() {
    this.pageViewsChart = null
    this.viewDevicesChart = null
    this.viewSourcesChart = null
  }

  get data() {
    const { activeTab } = this.props
    return this.props[activeTab]
  }

  renderCharts() {
    // !this.pageViewsChart && this.renderViewsChart()
    !this.viewDevicesChart && this.renderDevicesChart()
    !this.viewSourcesChart && this.renderSourcesChart()
  }

  renderViewsChart() {
    const { pageViews } = this.data
    const validatePageViews = []

    for (const pageView of pageViews) {
      const { count, date } = pageView
      const filterPageViews = validatePageViews.filter(
        validatePageView => validatePageView.date === date
      )
      if (filterPageViews.length) {
        filterPageViews[0].count += count
      } else {
        validatePageViews.push({
          count,
          date
        })
      }
    }

    const dateLabels = validatePageViews.map((pageView) => {
      const { date } = pageView
      return `${dateHelper.validator.fullDate(date)} ${dateHelper.validator.hour(date)}:00`
    })
    const viewDates = validatePageViews.map(pageView => pageView.count)
    const datasetsConfig = {
      data: viewDates,
      label: analysisTexts.hourlyViewChartTitle,
      pointBorderWidth: 0,
      pointRadius: 0
    }

    this.pageViewsChart = new Chart(this.pageViews, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINE_CONFIG, datasetsConfig)]
      },
      options: {
        title: {
          display: true,
          text: analysisTexts.hourlyViewChartTitle
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
            }
          }],
        },
        tooltips: {
          callbacks: {
            title: item => item[0].xLabel,
            label: item => `${item.yLabel} PV`
          }
        }
      }
    })
  }

  getDatas(type) {
    const {
      viewDevices,
      viewSources
    } = this.data
    const datas = {
      viewDevices: viewDevices.sort(sortByCount).slice(0, 6),
      viewSources: viewSources.sort(sortByCount).slice(0, 6),
    }
    return datas[type]
  }

  renderDevicesChart() {
    const viewDevices = this.getDatas('viewDevices')
    const labels = viewDevices.map(viewDevice => viewDevice.platform)
    const datas = viewDevices.map(viewDevice => viewDevice.count)

    const radarConfig = deepcopy(RADAR_CONFIG)
    radarConfig.data.labels = labels
    radarConfig.data.datasets[0].data = datas
    radarConfig.options.title.text = analysisTexts.platformChartTitle

    this.viewDevicesChart = new Chart(this.viewDevices, radarConfig)
  }

  renderSourcesChart() {
    const viewSources = this.getDatas('viewSources')
    const labels = viewSources.map(viewSource => viewSource.browser)
    const datas = viewSources.map(viewSource => viewSource.count)

    const radarConfig = deepcopy(RADAR_CONFIG)
    radarConfig.data.labels = labels
    radarConfig.data.datasets[0].data = datas
    radarConfig.options.title.text = analysisTexts.browserChartTitle

    this.viewSourcesChart = new Chart(this.viewSources, radarConfig)
  }

  renderCardInfo() {
    const { totalPV, pageViews, viewDevices, viewSources } = this.data
    const pageViewCounts = pageViews.map(item => item.count)
    const maxViewPerHour = Math.max(...pageViewCounts)

    const maxPlatformCount = Math.max(...viewDevices.map(viewDevice => viewDevice.count))
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform)

    const maxBrowserCount = Math.max(...viewSources.map(viewSource => viewSource.count))
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser)

    const sliders = [
      {
        mainText: totalPV,
        subText: analysisTexts.pv
      },
      {
        mainText: maxViewPerHour,
        subText: analysisTexts.maxPvPerHour
      },
      {
        mainText: platforms.slice(0, 2).join(','),
        subText: analysisTexts.platform
      },
      {
        mainText: browsers.join(','),
        subText: analysisTexts.browser
      }
    ]

    return (
      <Slick
        sliders={sliders}
        className={styles.card_info_wrapper}
      />
    )
  }

  renderChartCard(cardIdentify) {
    return (
      <div className={cx(sharedStyles.mobile_card, styles.chartCard)}>
        <div className={styles.share_info_chart}>
          <canvas
            className={sharedStyles.min_canvas}
            ref={ref => (this[cardIdentify] = ref)}
          />
        </div>
      </div>
    )
  }

  render() {
    const { actions, activeTab } = this.props

    return (
      <div className={styles.analysis}>

        <div className={styles.tabs}>
          <div className={styles.tabs_wrapper}>
            <div
              onClick={() => actions.onTabChange(RECORDS_SECTIONS.RESUME.ID)}
              className={cx(
                styles.tab,
                activeTab === RECORDS_SECTIONS.RESUME.ID && styles.tabActive
              )}
            >
              {analysisTexts.resume}
            </div>
            <div
              onClick={() => actions.onTabChange(RECORDS_SECTIONS.GITHUB.ID)}
              className={cx(
                styles.tab,
                activeTab === RECORDS_SECTIONS.GITHUB.ID && styles.tabActive
              )}
            >
              GitHub
            </div>
          </div>
        </div>
        {this.data.recordsLoading ? <Loading loading className={styles.loading} /> : this.renderCardInfo()}
        {this.renderChartCard('viewDevices')}
        {this.renderChartCard('viewSources')}

        {/* <div className={sharedStyles["share_section"]}>
          <div
            className={sharedStyles["share_info_chart"]}>
            <canvas
              className={sharedStyles["max_canvas"]}
              ref={ref => this.pageViews = ref}></canvas>
          </div>
        </div> */}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { ...state.records }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(recordsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileRecords)
