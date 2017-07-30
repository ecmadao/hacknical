import { getData } from './base';

const statistic = () => getData('/statistic');

const languages = () => getData('/languages');

export default {
  statistic,
  languages,
};
