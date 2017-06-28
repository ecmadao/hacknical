import { GREEN_COLORS } from './colors';
import locales from 'LOCALES';

const days = locales('datas').days;
const months = locales('datas').months;

export const DAYS = [
  days.sunday,
  days.monday,
  days.tuesday,
  days.wednesday,
  days.thursday,
  days.friday,
  days.saturday
];

export const MONTHS = {
  1: months['1'],
  2: months['2'],
  3: months['3'],
  4: months['4'],
  5: months['5'],
  6: months['6'],
  7: months['7'],
  8: months['8'],
  9: months['9'],
  10: months['10'],
  11: months['11'],
  12: months['12']
};

export const OPACITY = {
  max: 1,
  min: 0.3
};
