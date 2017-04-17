import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';
import { Loading, Input, IconButton } from 'light-ui';

import Api from 'API/index';
import dateHelper from 'UTILS/date';
import { getValidateViewSources } from 'UTILS/analysis';
import { LINE_CONFIG, RADAR_CONFIG } from 'SHARED/datas/chart_config';
import styles from '../styles/analysis.css';
import sharedStyles from '../../shared/styles/mobile.css';
import Slick from '../../shared/components/Slick';
import locales from 'LOCALES';
import { sortByX } from 'UTILS/helper';

const sortByCount = sortByX('count');
const analysisTexts = locales('dashboard').profile.common;

class MobileAnalysis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'github',
      resume: {
        loading: true,
        info: {
          url: '',
          openShare: false
        },
        viewDevices: [],
        viewSources: [],
        pageViews: []
      },
      github: {
        loading: true,
        info: {
          url: '',
          openShare: false
        },
        viewDevices: [],
        viewSources: [],
        pageViews: []
      }
    };
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;

    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(preProps, preState) {
    const { activeTab } = this.state;
    if (activeTab !== preState.activeTab) {
      this.reset();
      this.fetchData();
    }
    if (this.loading) { return; }
    this.renderCharts();
  }

  onTabChange(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  }

  reset() {
    this.pageViewsChart = null;
    this.viewDevicesChart = null;
    this.viewSourcesChart = null;
  }

  fetchData() {
    this.fetchShareData().then((result) => {
      this.initialState(result);
    });
  }

  get loading() {
    const { activeTab } = this.state;
    const loadings = {
      github: this.state.github.loading,
      resume: this.state.resume.loading,
    };
    return loadings[activeTab];
  }

  get fetchShareData() {
    const fetchFuncs = {
      github: Api.github.getShareRecords,
      resume: Api.resume.getShareRecords
    };
    const { activeTab } = this.state;
    return fetchFuncs[activeTab];
  }

  get dataObj() {
    const objs = {
      github: this.state.github,
      resume: this.state.resume,
    };
    const { activeTab } = this.state;
    return objs[activeTab];
  }

  renderCharts() {
    // !this.pageViewsChart && this.renderViewsChart();
    !this.viewDevicesChart && this.renderDevicesChart();
    !this.viewSourcesChart && this.renderSourcesChart();
  }

  renderViewsChart() {
    const { pageViews } = this.dataObj;
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
      label: analysisTexts.hourlyViewChartTitle,
      pointBorderWidth: 0,
      pointRadius: 0
    };

    this.pageViewsChart = new Chart(viewsChart, {
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
            title: (item, data) => {
              return item[0].xLabel
            },
            label: (item, data) => {
              return `${item.yLabel} PV`
            }
          }
        }
      }
    });
  }

  getDatas(type) {
    const {
      viewDevices,
      viewSources
    } = this.dataObj;
    const datas = {
      viewDevices: viewDevices.sort(sortByCount).slice(0, 6),
      viewSources: viewSources.sort(sortByCount).slice(0, 6),
    };
    return datas[type];
  }


  renderDevicesChart() {
    const viewDevices = this.getDatas('viewDevices');
    const viewDevicesChart = ReactDOM.findDOMNode(this.viewDevices);
    const labels = viewDevices.map(viewDevice => viewDevice.platform);
    const datas = viewDevices.map(viewDevice => viewDevice.count);

    const radarConfig = objectAssign({}, RADAR_CONFIG);
    radarConfig.data.labels = labels;
    radarConfig.data.datasets[0].data = datas;
    radarConfig.options.title.text = analysisTexts.platformChartTitle;

    this.viewDevicesChart = new Chart(viewDevicesChart, radarConfig);
  }

  renderSourcesChart() {
    const viewSources = this.getDatas('viewSources');
    const viewSourcesChart = ReactDOM.findDOMNode(this.viewSources);
    const labels = viewSources.map(viewSource => viewSource.browser);
    const datas = viewSources.map(viewSource => viewSource.count);

    const radarConfig = objectAssign({}, RADAR_CONFIG);
    radarConfig.data.labels = labels;
    radarConfig.data.datasets[0].data = datas;
    radarConfig.options.title.text = analysisTexts.browserChartTitle;

    this.viewSourcesChart = new Chart(viewSourcesChart, radarConfig);
  }

  initialState(datas) {
    const { activeTab } = this.state;
    const {
      url,
      openShare,
      viewDevices,
      viewSources,
      pageViews
    } = datas;
    const targetObj = this.state[activeTab];
    this.setState({
      [activeTab]: objectAssign({}, targetObj, {
        loading: false,
        userInfo: objectAssign({}, targetObj.userInfo, { url, openShare }),
        viewDevices: [...viewDevices],
        viewSources: getValidateViewSources(viewSources),
        pageViews: pageViews.filter(pageView => !isNaN(pageView.count))
      })
    });
  }

  renderCardInfo() {
    const { pageViews, viewDevices, viewSources } = this.dataObj;
    const pageViewCounts = pageViews.map(item => item.count);

    const viewCount = pageViewCounts.reduce((prev, current, index) => {
      return current + prev
    }, 0);
    const maxViewPerHour = Math.max(...pageViewCounts);

    const maxPlatformCount = Math.max(...viewDevices.map(viewDevice => viewDevice.count));
    const platforms = viewDevices
      .filter(viewDevice => viewDevice.count === maxPlatformCount)
      .map(viewDevice => viewDevice.platform);

    const maxBrowserCount = Math.max(...viewSources.map(viewSource => viewSource.count));
    const browsers = viewSources
      .filter(viewSource => viewSource.count === maxBrowserCount)
      .map(viewSource => viewSource.browser);

    const sliders = [
      {
        mainText: viewCount,
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
    ];

    return (
      <Slick
        sliders={sliders}
        className={styles["card_info_wrapper"]}
      />
    );
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div className={styles["analysis"]}>

        <div className={styles.tabs}>
          <div className={styles['tabs_wrapper']}>
            <div
              onClick={() => this.onTabChange('github')}
              className={cx(styles.tab, activeTab === 'github' && styles.tabActive)}>
              GitHub
            </div>
            <div
              onClick={() => this.onTabChange('resume')}
              className={cx(styles.tab, activeTab === 'resume' && styles.tabActive)}>
              简历
            </div>
          </div>
        </div>

        {this.loading ? (<Loading loading={true} />) : this.renderCardInfo()}
        <div className={sharedStyles["mobile_card"]}>
          <div
            className={styles["share_info_chart"]}>
            <canvas
              className={sharedStyles["min_canvas"]}
              ref={ref => this.viewDevices = ref}></canvas>
          </div>
        </div>
        <div className={sharedStyles["mobile_card"]}>
          <div
            className={styles["share_info_chart"]}>
            <canvas
              className={sharedStyles["min_canvas"]}
              ref={ref => this.viewSources = ref}></canvas>
          </div>
        </div>

        {/* <div className={sharedStyles["share_section"]}>
          <div
            className={sharedStyles["share_info_chart"]}>
            <canvas
              className={sharedStyles["max_canvas"]}
              ref={ref => this.pageViews = ref}></canvas>
          </div>
        </div> */}
      </div>
    );
  }
}

export default MobileAnalysis;
