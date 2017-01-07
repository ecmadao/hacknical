import objectAssign from 'object-assign';

import github from './github';
import { GREEN_COLORS } from './colors';
import { LINECHART_CONFIG } from './const_value';

const getStarDatasets = (repos) => {
  return {
    type: 'bar',
    label: 'stars',
    data: github.getReposStars(repos),
    backgroundColor: GREEN_COLORS[2],
    borderColor: GREEN_COLORS[0],
    borderWidth: 1
  }
};

const getForkDatasets = (repos) => {
  return {
    type: 'bar',
    label: 'forks',
    data: github.getReposForks(repos),
    backgroundColor: GREEN_COLORS[3],
    borderColor: GREEN_COLORS[1],
    borderWidth: 1
  }
};

const getCommitDatasets = (repos, commits) => {
  return objectAssign({}, LINECHART_CONFIG, {
    type: 'line',
    label: 'commits',
    data: github.getReposCommits(repos, commits),
  });
};

export default {
  getStarDatasets,
  getForkDatasets,
  getCommitDatasets
}
