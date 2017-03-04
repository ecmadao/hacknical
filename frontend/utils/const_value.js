import { GREEN_COLORS } from './colors';
import locales from 'LOCALES';

const days = locales('datas').days;

export const DAYS = [days.sunday, days.monday, days.tuesday, days.wednesday, days.thursday, days.friday, days.saturday];

export const LINECHART_CONFIG = {
  data: [],
  label: '',
  fill: true,
  // lineTension: 0.1,
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

export const OPACITY = {
  max: 1,
  min: 0.3
};
