import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Chart from 'chart.js'
import Clipboard from 'clipboard'
import deepcopy from 'deepcopy'
import {
  Input,
  Tipso,
  Loading,
  InfoCard,
  CardGroup,
  IconButton,
  ClassicCard,
  ClassicText
} from 'light-ui'
import Icon from 'COMPONENTS/Icon'
import github from 'UTILS/github'
import { GREEN_COLORS } from 'UTILS/constant'
import { RADAR_CONFIG } from 'UTILS/constant/chart'
import { VIEW_TYPES, LOGS_COUNT } from 'UTILS/constant/records'
import dateHelper from 'UTILS/date'
import styles from '../styles/records.css'
import locales from 'LOCALES'
import message from 'UTILS/message'
import StockChart from 'COMPONENTS/HighStock'
import { getPVStockConfig } from 'UTILS/stock'
import { LogCard } from './LogCard'

const titleTexts = locales('dashboard').records.title
const recordsTexts = locales('dashboard').records.common
const sortByCount = github.sortByX({ key: 'count' })

class ShareRecords extends React.Component {
  constructor(props) {
    super(props)
    this.qrcode = null
    this.clipboard = null
    this.viewDevicesChart = null
    this.viewSourcesChart = null
    this.copyUrl = this.copyUrl.bind(this)
  }

  componentDidMount() {
    const { actions } = this.props
    actions.fetchShareData()
  }

  componentDidUpdate() {
    const { recordsLoading, actions, recordsFetched } = this.props
    actions.fetchShareData()

    if (recordsLoading || !recordsFetched) return
    !this.viewDevicesChart && this.renderDevicesChart()
    !this.viewSourcesChart && this.renderSourcesChart()
    !this.qrcode && this.renderQrcode()
    !this.clipboard && this.renderClipboard()
  }

  componentWillUpdate(nextProps) {
    const { index } = this.props
    if (index !== nextProps.index) {
      this.viewDevicesChart && this.viewDevicesChart.destroy()
      this.viewSourcesChart && this.viewSourcesChart.destroy()
      this.clipboard && this.clipboard.destroy()

      this.viewDevicesChart = null
      this.viewSourcesChart = null
      this.qrcode = null
      this.clipboard = null
    }
  }

  renderClipboard() {
    const { index } = this.props
    this.clipboard = new Clipboard(`#copyLinkButton-${index}`, {
      text: () => $(`#shareGithubUrl-${index}`).val()
    })
  }

  copyUrl() {
    const { index } = this.props
    document.querySelector(`#shareGithubUrl-${index}`).select()
    message.notice(recordsTexts.copied)
  }

  renderShareController() {
    const { info, index, text } = this.props
    if (!info) return null

    const controllerClass = cx(
      styles.share_controller_card,
      !info.openShare && styles.disabled
    )
    const { url } = info

    return [
      <div className={styles.viewTitle} key="viewTitle">
        <Icon icon="link" />
        &nbsp;&nbsp;
        {titleTexts.link}
        &nbsp;&nbsp;
      </div>,
      <div className={controllerClass} key="shareController">
        <ClassicCard className={styles.shareCard} bgClassName={styles.shareCardBg} hoverable={false}>
          <div className={styles.share_controller}>
            <Tipso
              position="top"
              wrapperClass={styles.share_container_wrapper}
              tipsoContent={(
                <div className={styles.qrcode_container}>
                  <div id={`qrcode-${index}`} />
                  <span>{text}</span>
                </div>
              )}
            >
              <div className={styles.share_container}>
                <Input
                  theme="flat"
                  id={`shareGithubUrl-${index}`}
                  value={`${window.location.origin}/${url}`}
                />
                <IconButton
                  color="gray"
                  icon="clipboard"
                  id={`copyLinkButton-${index}`}
                  onClick={this.copyUrl}
                />
              </div>
            </Tipso>
          </div>
        </ClassicCard>
      </div>
    ]
  }

  get pageViewsData() {
    const { viewType } = this.props
    const views = {
      [VIEW_TYPES.HOURLY.ID]: () => this.basePageViews(VIEW_TYPES.HOURLY.FORMAT),
      [VIEW_TYPES.DAILY.ID]: () => this.basePageViews(VIEW_TYPES.DAILY.FORMAT),
      [VIEW_TYPES.MONTHLY.ID]: () => this.basePageViews(VIEW_TYPES.MONTHLY.FORMAT),
    }
    return views[viewType]()
  }

  getPageViewDate(date) {
    const { viewType } = this.props
    const dates = {
      [VIEW_TYPES.HOURLY.ID]: () =>
        `${dateHelper.validator.fullDate(date)} ${dateHelper.validator.hour(date)}:00`,
      [VIEW_TYPES.DAILY.ID]: () => dateHelper.validator.fullDate(date),
      [VIEW_TYPES.MONTHLY.ID]: () => dateHelper.validator.date(date),
    }
    return dates[viewType]()
  }

  basePageViews(dateFormat) {
    const { pageViews } = this.props
    const validatePageViews = {}
    for (const pageView of pageViews) {
      const { count, date } = pageView
      const validateDate = this.getPageViewDate(date)
      if (!validatePageViews[validateDate]) {
        validatePageViews[validateDate] = {
          count: 0,
          seconds: dateHelper.seconds.getByDate(validateDate)
        }
      }
      validatePageViews[validateDate].count += count
    }

    const viewDates = Object.keys(validatePageViews)
      .map(key => validatePageViews[key])
      .sort((pre, next) => pre.seconds - next.seconds)

    return {
      dateFormat,
      pageViews: viewDates.reduce((res, cur, index) => {
        if (index > 0) {
          let { seconds } = viewDates[index - 1]
          // TODO: support other intervals
          while (seconds + (24 * 60 * 60) < cur.seconds) {
            seconds += (24 * 60 * 60)
            res.push({ count: 0, seconds })
          }
        }
        res.push(cur)
        return res
      }, [])
    }
  }

  renderQrcode() {
    const { info, index } = this.props
    const { url } = info
    const qrcodeId = `qrcode-${index}`
    $(`#${qrcodeId}`).empty()
    if (!window.QRCode) return

    this.qrcode = new QRCode(document.getElementById(qrcodeId), {
      text: `${window.location.origin}/${url}`,
      width: 120,
      height: 120,
      colorDark: GREEN_COLORS[1],
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
  }

  renderDevicesChart() {
    const viewDevices = this.getDatas('viewDevices')
    const labels = viewDevices.map(viewDevice => viewDevice.platform)
    const datas = viewDevices.map(viewDevice => viewDevice.count)

    const radarConfig = deepcopy(RADAR_CONFIG)
    radarConfig.data.labels = labels
    radarConfig.data.datasets[0].data = datas
    radarConfig.options.title.text = recordsTexts.platformChartTitle

    this.viewDevicesChart = new Chart(this.viewDevices, radarConfig)
  }

  renderSourcesChart() {
    const viewSources = this.getDatas('viewSources')
    const labels = viewSources.map(viewSource => viewSource.browser)
    const datas = viewSources.map(viewSource => viewSource.count)

    const radarConfig = deepcopy(RADAR_CONFIG)
    radarConfig.data.labels = labels
    radarConfig.data.datasets[0].data = datas
    radarConfig.options.title.text = recordsTexts.browserChartTitle

    this.viewSourcesChart = new Chart(this.viewSources, radarConfig)
  }

  renderChartInfo() {
    const { totalPV, viewDevices, viewSources } = this.props

    const maxPlatformCount = Math.max(
      ...viewDevices.map(viewDevice => viewDevice.count)
    )
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform)

    const maxBrowserCount = Math.max(
      ...viewSources.map(viewSource => viewSource.count)
    )
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser)

    return (
      <CardGroup className={styles.card_group}>
        <InfoCard className={styles.infoCard}>
          <ClassicText text={totalPV} theme="green" className={styles.infoText}/>
          <br/>
          <span className={styles.infoTextSub}>{recordsTexts.pv}</span>
        </InfoCard>
        <InfoCard className={styles.infoCard}>
          <ClassicText text={platforms.slice(0, 2).join(',') || 'unknown'} theme="green" className={styles.infoText}/>
          <br/>
          <span className={styles.infoTextSub}>{recordsTexts.platform}</span>
        </InfoCard>
        <InfoCard className={styles.infoCard}>
          <ClassicText text={browsers.join(',') || 'unknown'} theme="green" className={styles.infoText}/>
          <br/>
          <span className={styles.infoTextSub}>{recordsTexts.browser}</span>
        </InfoCard>
      </CardGroup>
    )
  }

  getDatas(type) {
    const {
      viewDevices,
      viewSources
    } = this.props
    const datas = {
      viewDevices: viewDevices.sort(sortByCount).slice(0, 6),
      viewSources: viewSources.sort(sortByCount).slice(0, 6)
    }

    return datas[type]
  }

  render() {
    const {
      status,
      index,
      viewLogs,
      logsLoading,
      recordsLoading,
      onTransitionEnd
    } = this.props

    const viewData = this.pageViewsData
    const config = getPVStockConfig(viewData)
    const { pageViews } = viewData

    return (
      <div
        className={cx(
          styles.card_container,
          styles.recordsContainer,
          styles[`recordsContainer-${status}`]
        )}
        onTransitionEnd={onTransitionEnd}
      >
        {this.renderShareController()}
        <div className={styles.viewTitle}>
          <Icon icon="chrome" />
          &nbsp;&nbsp;
          {titleTexts.logs.replace('{LOGS_COUNT}', LOGS_COUNT)}
          &nbsp;&nbsp;
        </div>
        <LogCard loading={logsLoading} viewLogs={viewLogs} />
        <div className={styles.viewTitle}>
          <Icon icon="bar-chart" />
          &nbsp;&nbsp;
          {titleTexts.statistic}
          &nbsp;&nbsp;
        </div>
        {recordsLoading ? (<Loading loading />) : (
          <ClassicCard className={styles.shareCard} bgClassName={styles.shareCardBg} hoverable={false}>
            <div className={cx(styles.card, styles.cardLite)}>
              {this.renderChartInfo()}
              <div className={styles.chart_container}>
                <div
                  className={cx(
                    styles.radar_chart,
                    styles.viewDevicesChart
                  )}
                >
                  <canvas
                    className={styles.radarChart}
                    ref={ref => (this.viewDevices = ref)}
                  />
                </div>
                <div
                  className={cx(
                    styles.radar_chart,
                    styles.viewSourcesChart
                  )}
                >
                  <canvas
                    className={styles.radarChart}
                    ref={ref => (this.viewSources = ref)}
                  />
                </div>
              </div>
              <div
                className={cx(
                  styles.chart_container,
                  styles.pageview_chart_container
                )}
              >
                <StockChart
                  tag={index}
                  data={pageViews}
                  config={config}
                />
              </div>
            </div>
          </ClassicCard>
        )}
      </div>
    )
  }
}

ShareRecords.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  recordsLoading: PropTypes.bool,
  logsLoading: PropTypes.bool,
  text: PropTypes.string,
  info: PropTypes.object,
  actions: PropTypes.object,
  pageViews: PropTypes.array,
  viewDevices: PropTypes.array,
  viewSources: PropTypes.array,
  viewType: PropTypes.string
}

ShareRecords.defaultProps = {
  index: 0,
  recordsLoading: true,
  logsLoading: true,
  text: '',
  info: {
    openShare: false,
    url: ''
  },
  actions: {},
  pageViews: [],
  viewDevices: [],
  viewSources: [],
  viewType: ''
}

export default ShareRecords
