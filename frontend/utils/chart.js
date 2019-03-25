
import objectAssign from 'UTILS/object-assign'
import github from 'UTILS/github'
import { GREEN_COLORS } from 'UTILS/constant'
import { LINE_CONFIG } from 'UTILS/constant/chart'

const getStarDatasets = repos => ({
  type: 'bar',
  label: 'stars',
  data: github.getReposStars(repos),
  backgroundColor: GREEN_COLORS[2],
  borderColor: GREEN_COLORS[0],
  borderWidth: 1
})

const getForkDatasets = repos => ({
  type: 'bar',
  label: 'forks',
  data: github.getReposForks(repos),
  backgroundColor: GREEN_COLORS[3],
  borderColor: GREEN_COLORS[1],
  borderWidth: 1
})

const getCommitDatasets = (repos, commits) => objectAssign({}, LINE_CONFIG, {
  type: 'line',
  label: 'commits',
  data: github.getReposCommits(repos, commits)
})

const doughnutDatasets = (data, backgroundColor = [...GREEN_COLORS].slice(0)) => ({
  data,
  label: '',
  borderWidth: 2,
  backgroundColor,
  type: 'doughnut'
})

const polarAreaDatasets = data => ({
  data,
  label: '',
  type: 'polarArea',
  backgroundColor: [...GREEN_COLORS].slice(1).reverse(),
  borderWidth: 2
})

const radarDatasets = data => ({
  data,
  label: '',
  fill: true,
  type: 'radar',
  borderWidth: 2,
  pointBorderColor: '#fff',
  borderColor: GREEN_COLORS[0],
  backgroundColor: GREEN_COLORS[4],
  pointHoverBackgroundColor: '#fff',
  pointBackgroundColor: GREEN_COLORS[0],
  pointHoverBorderColor: GREEN_COLORS[0]
})

export default {
  repos: {
    starsDatasets: getStarDatasets,
    forksDatasets: getForkDatasets,
    commitsDatasets: getCommitDatasets
  },
  radar: radarDatasets,
  doughnut: doughnutDatasets,
  polarArea: polarAreaDatasets
}
