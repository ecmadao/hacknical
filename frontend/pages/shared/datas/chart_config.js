import { GREEN_COLORS } from 'UTILS/colors';

export const RADAR_CONFIG = {
  type: 'radar',
  data: {
    labels: [],
    datasets: [{
      data: [],
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
      text: ''
    },
    legend: {
      display: false,
    }
  }
};

export const LINE_CONFIG = {
  data: [],
  label: '',
  fill: true,
  backgroundColor: GREEN_COLORS[4],
  borderWidth: 2,
  borderColor: GREEN_COLORS[0],
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: GREEN_COLORS[1],
  pointBackgroundColor: "#fff",
  pointBorderWidth: 2,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: GREEN_COLORS[0],
  pointHoverBorderColor: "rgba(220,220,220,1)",
  pointHoverBorderWidth: 4,
  pointRadius: 3,
  pointHitRadius: 10,
  spanGaps: false,
};
