import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from '../redux/actions';
import cx from 'classnames';
import Chart from 'chart.js';
import Clipboard from 'clipboard';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';

import Loading from 'COMPONENTS/Loading';
import IconButton from 'COMPONENTS/IconButton';
import Switcher from 'COMPONENTS/Switcher';
import Input from 'COMPONENTS/Input';
import ChartInfo from 'COMPONENTS/ChartInfo';
import { LINECHART_CONFIG } from 'UTILS/const_value';
import { GREEN_COLORS } from 'UTILS/colors';

import styles from '../styles/profile.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;
    this.copyUrl = this.copyUrl.bind(this);
  }

  copyUrl() {
    document.querySelector("#shareLink").select();
  }

  renderShareController() {
    const { actions, userInfo } = this.props;
    const { openShare, url } = userInfo;
    return (
      <div className={styles["share_controller"]}>
        <Switcher
          id="share_switch"
          onChange={actions.toggleShareStatus}
          checked={openShare}
        />
        <div className={styles["share_container"]}>
          <Input
            id="shareLink"
            style="flat"
            value={`${window.location.origin}/${url}`}
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

  renderViewsChart() {
    const { pageViews } = this.props;
    const viewsChart = ReactDOM.findDOMNode(this.pageViews);
    const dateLabels = pageViews.map(pageView => pageView.date);
    const viewDates = pageViews.map(pageView => pageView.count);
    this.pageViewsChart = new Chart(viewsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: viewDates,
          label: '每小时浏览量',
        })]
      },
      options: {
        scales: {
          xAxes: [{
            // display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero:true
            }
          }],
        }
      }
    })
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchGithubShareData();
    // this.renderQrcode();
    new Clipboard('#copyLinkButton', {
      text: () => $("#shareLink").val()
    });
  }

  componentDidUpdate() {
    const { loading } = this.props;
    if (loading) { return }
    !this.pageViewsChart && this.renderViewsChart();
    !this.viewDevicesChart && this.renderDevicesChart();
    !this.viewSourcesChart && this.renderSourcesChart();
  }

  renderDevicesChart() {
    const { viewDevices } = this.props;
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
    const { viewSources } = this.props;
    const viewSourcesChart = ReactDOM.findDOMNode(this.viewSources);
    const labels = viewSources.map((viewSource) => {
      const { browser, from } = viewSource;
      if (browser !== "unknown") { return browser }
      if (from) {
        return "wechat"
      }
    });
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

  renderChartInfo() {
    const { pageViews, viewDevices, viewSources } = this.props;
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
      <div className={styles["chart_info_container"]}>
        <ChartInfo
          mainText={viewCount}
          subText="总 PV"
        />
        <ChartInfo
          mainText={platforms.join(',')}
          subText="使用最多的平台"
        />
        <ChartInfo
          mainText={browsers.join(',')}
          subText="使用最多的浏览器"
        />
      </div>
    )
  }

  render() {
    const { actions, loading } = this.props;
    return (
      <div>
        <div className={styles["card_container"]}>
          <p><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;github 分享数据</p>
          <div className={styles["share_controller_card"]}>
            {loading ? (
              <Loading />
            ) : this.renderShareController()}
          </div>
          <div className={styles["card"]}>
            {this.renderChartInfo()}
            <div className={styles["chart_container"]}>
              <div className={styles["radar_chart"]}>
                <canvas ref={ref => this.viewDevices = ref}></canvas>
              </div>
              <div className={styles["radar_chart"]}>
                <canvas ref={ref => this.viewSources = ref}></canvas>
              </div>
            </div>
            <div className={styles["chart_container"]}>
              <canvas ref={ref => this.pageViews = ref}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.profile}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
