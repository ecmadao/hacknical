import dateHelper from './date';
import objectAssign from './object-assign';

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
          return dateHelper.date.bySeconds(this.value);
        }
      }
    },
  },
  rangeSelector: {
    buttonPosition: { x: -100, y: -100 },
    inputEnabled: false,
    selected: 0
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
        return dateHelper.date.bySeconds(this.value);
      }
    },
    lineWidth: 0,
    events: {}
  }],
  yAxis: [],
  series: []
};

const PV_STOCK_CONFIG = {
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
      name: 'page view',
      animation: true,
      data: [],
      // pointPlacement: 0.2,
      color: 'rgba(158, 170, 179, 0.7)',
      states: {
        hover: {
          color: '#9EAAB3'
        }
      },
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
};

const COMMITS_STOCK_CONFIG = {
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
      name: 'commits',
      animation: true,
      data: [],
      color: 'rgba(55, 178, 77, 0.7)',
      states: {
        hover: {
          color: '#37b24d'
        }
      },
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
};

export const getPVStockConfig = (options) => {
  const {
    pageViews,
    dateFormat
  } = options;
  const seriesData = pageViews.map((pageView) => {
    const { count, seconds } = pageView;
    return [seconds, count];
  });

  const config = objectAssign(
    {},
    BASE_STOCK_CONFIG,
    PV_STOCK_CONFIG
  );
  config.series[0].data = seriesData;
  config.xAxis[0].labels.formatter = function formatter() {
    return dateHelper.date.bySeconds(this.value, dateFormat);
  };
  config.tooltip.formatter = function formatter() {
    const date = dateHelper.date.bySeconds(this.x, dateFormat);
    const val = this.points[0].y;
    return `
      <div style="color: white;">
        ${date}<br/>
        <div style="color: white;">${val}</div>
      </div>
    `;
  };
  return config;
};

export const getCommitsStockConfig = (commits) => {
  const config = objectAssign(
    {},
    BASE_STOCK_CONFIG,
    COMMITS_STOCK_CONFIG
  );
  config.series[0].data = [];
  return config;
};
