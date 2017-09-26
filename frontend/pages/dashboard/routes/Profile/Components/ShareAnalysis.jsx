import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Chart from 'chart.js';
import Clipboard from 'clipboard';
import deepcopy from 'deepcopy';
import {
  Input,
  Tipso,
  Loading,
  InfoCard,
  CardGroup,
  IconButton,
} from 'light-ui';
import objectAssign from 'UTILS/object-assign';
import github from 'UTILS/github';
import { GREEN_COLORS } from 'UTILS/colors';
import { RADAR_CONFIG, LINE_CONFIG } from 'SHARED/datas/chart_config';
import dateHelper from 'UTILS/date';
import styles from '../styles/profile.css';
import locales from 'LOCALES';
import { VIEW_TYPES } from '../shared/data';

const profileTexts = locales('dashboard').profile.common;
const sortByCount = github.sortByX('count');

class ShareAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.qrcode = null;
    this.clipboard = null;
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;
    this.copyUrl = this.copyUrl.bind(this);
  }

  componentDidMount() {
    const { loading, actions, fetched } = this.props;
    if (!loading && !fetched) actions.fetchShareData();
  }

  componentDidUpdate() {
    const { loading, actions, fetched } = this.props;
    if (!loading && !fetched) actions.fetchShareData();
    if (loading || !fetched) { return; }
    !this.pageViewsChart && this.renderViewsChart();
    !this.viewDevicesChart && this.renderDevicesChart();
    !this.viewSourcesChart && this.renderSourcesChart();
    !this.qrcode && this.renderQrcode();
    !this.clipboard && this.renderClipboard();
  }

  componentWillUpdate(nextProps) {
    const { index } = this.props;
    if (index !== nextProps.index) {
      this.pageViewsChart && this.pageViewsChart.destroy();
      this.viewDevicesChart && this.viewDevicesChart.destroy();
      this.viewSourcesChart && this.viewSourcesChart.destroy();
      this.clipboard && this.clipboard.destroy();

      this.pageViewsChart = null;
      this.viewDevicesChart = null;
      this.viewSourcesChart = null;
      this.qrcode = null;
      this.clipboard = null;
    }
  }

  renderClipboard() {
    const { index } = this.props;
    this.clipboard = new Clipboard(`#copyLinkButton-${index}`, {
      text: () => $(`#shareGithubUrl-${index}`).val()
    });
  }

  copyUrl() {
    const { index } = this.props;
    document.querySelector(`#shareGithubUrl-${index}`).select();
  }

  renderShareController() {
    const { info, index, text } = this.props;
    const { url } = info;

    return (
      <div className={styles.share_controller}>
        <Tipso
          position="bottom"
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
    )
  }

  get pageViewsData() {
    const { viewType } = this.props;
    const views = {
      [VIEW_TYPES.HOURLY.ID]: this.hourlyPageViews(VIEW_TYPES.HOURLY.TEXT),
      [VIEW_TYPES.DAILY.ID]: this.dailyPageViews(VIEW_TYPES.DAILY.TEXT),
      [VIEW_TYPES.MONTHLY.ID]: this.monthlyPageViews(VIEW_TYPES.MONTHLY.TEXT),
    };
    return views[viewType]();
  }

  getPageViewDate(date) {
    const { viewType } = this.props;
    const dates = {
      [VIEW_TYPES.HOURLY.ID]: () =>
        `${dateHelper.validator.fullDate(date)} ${dateHelper.validator.hour(date)}:00`,
      [VIEW_TYPES.DAILY.ID]: () => dateHelper.validator.fullDate(date),
      [VIEW_TYPES.MONTHLY.ID]: () => dateHelper.validator.date(date),
    };
    return dates[viewType]();
  }

  basePageViews(title) {
    const { pageViews } = this.props;
    const validatePageViews = {};

    pageViews.forEach((pageView) => {
      const { count, date } = pageView;
      const validateDate = this.getPageViewDate(date);
      const targetPageViews = validatePageViews[validateDate] || 0;
      validatePageViews[validateDate] = targetPageViews + count;
    });
    const dateLabels = Object.keys(validatePageViews);
    const viewDates = dateLabels.map(key => validatePageViews[key]);

    const datasetsConfig = {
      label: title,
      data: viewDates,
    };
    return {
      dateLabels,
      datasetsConfig,
    };
  }

  hourlyPageViews(title) {
    return () => this.basePageViews(title);
  }

  dailyPageViews(title) {
    return () => this.basePageViews(title);
  }

  monthlyPageViews(title) {
    return () => this.basePageViews(title);
  }

  renderViewsChart() {
    const {
      dateLabels,
      datasetsConfig,
    } = this.pageViewsData;

    if (dateLabels.length >= 20) {
      datasetsConfig.pointBorderWidth = 0;
      datasetsConfig.pointRadius = 0;
    }
    this.pageViewsChart = new Chart(this.pageViews, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [
          objectAssign({}, LINE_CONFIG, datasetsConfig)
        ]
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }],
        },
        tooltips: {
          callbacks: {
            title: item => item[0].xLabel,
            label: item => `浏览量：${item.yLabel} PV`
          }
        }
      }
    })
  }

  renderQrcode() {
    const { info, index } = this.props;
    const { url } = info;
    const qrcodeId = `qrcode-${index}`;
    $(`#${qrcodeId}`).empty();
    this.qrcode = new QRCode(document.getElementById(qrcodeId), {
      text: `${window.location.origin}/${url}`,
      width: 120,
      height: 120,
      colorDark: GREEN_COLORS[1],
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  renderDevicesChart() {
    const viewDevices = this.getDatas('viewDevices');
    const labels = viewDevices.map(viewDevice => viewDevice.platform);
    const datas = viewDevices.map(viewDevice => viewDevice.count);

    const radarConfig = deepcopy(RADAR_CONFIG);
    radarConfig.data.labels = labels;
    radarConfig.data.datasets[0].data = datas;
    radarConfig.options.title.text = profileTexts.platformChartTitle;

    this.viewDevicesChart = new Chart(this.viewDevices, radarConfig);
  }

  renderSourcesChart() {
    const viewSources = this.getDatas('viewSources');
    const labels = viewSources.map(viewSource => viewSource.browser);
    const datas = viewSources.map(viewSource => viewSource.count);

    const radarConfig = deepcopy(RADAR_CONFIG);
    radarConfig.data.labels = labels;
    radarConfig.data.datasets[0].data = datas;
    radarConfig.options.title.text = profileTexts.browserChartTitle;

    this.viewSourcesChart = new Chart(this.viewSources, radarConfig);
  }

  renderChartInfo() {
    const { pageViews, viewDevices, viewSources } = this.props;
    const viewCount = pageViews.reduce((prev, current, index) => {
      if (index === 0) {
        return current.count;
      }
      return current.count + prev;
    }, '');
    const maxPlatformCount = Math.max(
      ...viewDevices.map(viewDevice => viewDevice.count)
    );
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform);

    const maxBrowserCount = Math.max(
      ...viewSources.map(viewSource => viewSource.count)
    );
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser);

    return (
      <CardGroup className={styles.card_group}>
        <InfoCard
          tipsoTheme="dark"
          mainText={viewCount}
          subText={profileTexts.pv}
        />
        <InfoCard
          tipsoTheme="dark"
          mainText={platforms.slice(0, 2).join(',')}
          subText={profileTexts.platform}
        />
        <InfoCard
          tipsoTheme="dark"
          mainText={browsers.join(',')}
          subText={profileTexts.browser}
        />
      </CardGroup>
    );
  }

  getDatas(type) {
    const {
      viewDevices,
      viewSources
    } = this.props;
    const datas = {
      viewDevices: viewDevices.sort(sortByCount).slice(0, 6),
      viewSources: viewSources.sort(sortByCount).slice(0, 6),
    };

    return datas[type];
  }

  renderPVChartController() {
    const { viewType, actions } = this.props;
    const controllers = [];
    const viewTypeKeys = Object.keys(VIEW_TYPES);
    viewTypeKeys.forEach((key, i) => {
      const {
        ID,
        SHORT,
      } = VIEW_TYPES[key];
      const isActive = ID === viewType;
      const onClick = isActive
        ? () => {}
        : () => {
          this.pageViewsChart.destroy();
          this.pageViewsChart = null;
          actions.onViewTypeChange(ID);
        };

      controllers.push((
        <span
          key={controllers.length}
          className={cx(
            styles.chart_controller,
            isActive && styles.controller_active
          )}
          onClick={onClick}
        >
          {SHORT}
        </span>
      ));
      if (i !== viewTypeKeys.length - 1) {
        controllers.push((
          <span key={controllers.length}>
            &nbsp;/&nbsp;
          </span>
        ));
      }
    })
    return (
      <div className={styles.chart_controllers}>
        {controllers}
      </div>
    );
  }

  render() {
    const { loading, info } = this.props;
    const controllerClass = cx(
      styles.share_controller_card,
      !info.openShare && styles.disabled
    );
    return (
      <div className={styles.card_container}>
        {loading ? '' : (
          <div className={controllerClass}>
            {this.renderShareController()}
          </div>
        )}
        {loading ? (<Loading loading />) : (
          <div className={styles.card}>
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
              {this.renderPVChartController()}
              <canvas ref={ref => (this.pageViews = ref)} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

ShareAnalysis.propTypes = {
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  text: PropTypes.string,
  info: PropTypes.object,
  actions: PropTypes.object,
  pageViews: PropTypes.array,
  viewDevices: PropTypes.array,
  viewSources: PropTypes.array,
  viewType: PropTypes.string,
};

ShareAnalysis.defaultProps = {
  index: 0,
  loading: true,
  text: '',
  info: {
    openShare: false,
    url: ''
  },
  actions: {},
  pageViews: [],
  viewDevices: [],
  viewSources: [],
  viewType: '',
};

export default ShareAnalysis;
