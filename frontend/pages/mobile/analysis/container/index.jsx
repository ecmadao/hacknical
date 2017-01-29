import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';

import Api from 'API/index';
import dateHelper from 'UTILS/date';
import { getValidateViewSources } from 'UTILS/analysis';
import { LINECHART_CONFIG } from 'UTILS/const_value';
import { GREEN_COLORS } from 'UTILS/colors';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import Switcher from 'COMPONENTS/Switcher';
import Input from 'COMPONENTS/Input';
import IconButton from 'COMPONENTS/IconButton';
import styles from '../styles/analysis.css';
import sharedStyles from '../../shared/styles/index.css';

class MobileAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userInfo: {
        url: '',
        openShare: false
      },
      viewDevices: [],
      viewSources: [],
      pageViews: []
    };
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;

    this.copyUrl = this.copyUrl.bind(this);
    this.postShareStatus = this.postShareStatus.bind(this);
  }

  componentDidMount() {
    console.log('getShareData');
    Api.github.getShareData().then((result) => {
      this.initialState(result);
    });
  }

  componentDidUpdate() {
    const { loading } = this.state;
    if (loading) { return }
    this.renderCharts();
  }

  copyUrl() {
    document.querySelector("#shareGithubUrl").select();
  }

  postShareStatus() {
    const { userInfo } = this.state;
    const { openShare } = userInfo;
    Api.github.toggleShare(!openShare).then((result) => {
      this.setState({
        userInfo: objectAssign({}, userInfo, { openShare: !openShare })
      });
    });
  }

  renderCharts() {
    !this.pageViewsChart && this.renderViewsChart();
    !this.viewDevicesChart && this.renderDevicesChart();
    !this.viewSourcesChart && this.renderSourcesChart();
  }

  renderViewsChart() {
    const { pageViews } = this.state;
    const viewsChart = ReactDOM.findDOMNode(this.pageViews);
    const validatePageViews = [];
    pageViews.forEach((pageView) => {
      const { count, date } = pageView;
      const filterPageViews = validatePageViews.filter(validatePageView => validatePageView.date === date);
      if(filterPageViews.length) {
        filterPageViews[0].count += count;
      } else {
        validatePageViews.push({
          count,
          date
        });
      }
    });
    const dateLabels = validatePageViews.map((pageView) => {
      const { date } = pageView;
      return `${dateHelper.validator.fullDate(date)} ${dateHelper.validator.hour(date)}:00`;
    });
    const viewDates = validatePageViews.map(pageView => pageView.count);
    const datasetsConfig = {
      data: viewDates,
      label: '每小时浏览量',
      pointBorderWidth: 0,
      pointRadius: 0
    };

    this.pageViewsChart = new Chart(viewsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINECHART_CONFIG, datasetsConfig)]
      },
      options: {
        title: {
          display: true,
          text: '每小时浏览量'
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
            title: (item, data) => {
              return item[0].xLabel
            },
            label: (item, data) => {
              return `浏览量：${item.yLabel} PV`
            }
          }
        }
      }
    });
  }

  renderDevicesChart() {
    const { viewDevices } = this.state;
    const viewDevicesChart = ReactDOM.findDOMNode(this.viewDevices);
    const labels = viewDevices.map(viewDevice => viewDevice.platform);
    const datas = viewDevices.map(viewDevice => viewDevice.count);
    this.viewDevicesChart = new Chart(viewDevicesChart, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: datas,
          label: '',
          fill: true,
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 1,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: '浏览量来源平台'
        },
        legend: {
          display: false,
        }
      }
    });
  }

  renderSourcesChart() {
    const { viewSources } = this.state;
    const viewSourcesChart = ReactDOM.findDOMNode(this.viewSources);
    const labels = viewSources.map(viewSource => viewSource.browser);
    const datas = viewSources.map(viewSource => viewSource.count);

    this.viewSourcesChart = new Chart(viewSourcesChart, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: datas,
          label: '',
          fill: true,
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 1,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: '浏览器分布'
        },
        legend: {
          display: false,
        }
      }
    });
  }

  initialState(datas) {
    const { userInfo } = this.state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = datas;
    this.setState({
      loading: false,
      userInfo: objectAssign({}, userInfo, { url, openShare }),
      viewDevices: [...viewDevices],
      viewSources: getValidateViewSources(viewSources),
      pageViews: pageViews.filter(pageView => !isNaN(pageView.count))
    });
  }

  renderShareController() {
    const { actions, userInfo } = this.state;
    const { openShare, url } = userInfo;
    return (
      <div className={styles["share_controller"]}>
        <Switcher
          id="share_switch"
          size="small"
          onChange={this.postShareStatus}
          checked={openShare}
        />
        <div
          className={styles["share_container"]}>
          <Input
            id="shareGithubUrl"
            style="flat"
            value={`${window.location.origin}/${url}`}
            customStyle={styles["share_link_input"]}
          />
          <IconButton
            icon="clipboard"
            id="copyLinkButton"
            onClick={this.copyUrl.bind(this)}
          />
        </div>
      </div>
    )
  }

  renderChartInfo() {
    const { pageViews, viewDevices, viewSources } = this.state;
    const viewCount = pageViews.reduce((prev, current, index) => {
      if (index === 0) {
        return current.count;
      }
      return current.count + prev;
    }, '');
    const maxPlatformCount = Math.max(...viewDevices.map(viewDevice => viewDevice.count));
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform);

    const maxBrowserCount = Math.max(...viewSources.map(viewSource => viewSource.count));
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser);

    return (
      <div
        className={cx(sharedStyles["info_wrapper"], styles["info_wrapper"])}>
        <div className={sharedStyles["share_info"]}>
          <ChartInfo
            mainText={viewCount}
            subText="总 PV"
            mainTextStyle={sharedStyles["share_chart_main_text"]}
          />
          <ChartInfo
            mainText={platforms.slice(0, 2).join(',')}
            subText="使用最多的平台"
            mainTextStyle={sharedStyles["share_chart_main_text"]}
          />
        </div>
        <div className={sharedStyles["share_info"]}>
          <ChartInfo
            mainText={browsers.join(',')}
            subText="使用最多的浏览器"
            mainTextStyle={sharedStyles["share_chart_main_text"]}
          />
        </div>
      </div>
    )
  }

  render() {
    const { loading, userInfo } = this.state;

    return (
      <div className={styles["analysis"]}>
        {loading ? '' : this.renderShareController()}
        {loading ? (
          <Loading />
        ) : this.renderChartInfo()}
        <div className={sharedStyles["share_section"]}>
          <div
            className={styles["share_info_chart"]}>
            <canvas
              ref={ref => this.viewDevices = ref}></canvas>
          </div>
          <div
            className={styles["share_info_chart"]}>
            <canvas
              ref={ref => this.viewSources = ref}></canvas>
          </div>
        </div>
        <div className={sharedStyles["share_section"]}>
          <div
            className={sharedStyles["share_info_chart"]}>
            <canvas
              className={sharedStyles["max_canvas"]}
              ref={ref => this.pageViews = ref}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default MobileAnalysis;
