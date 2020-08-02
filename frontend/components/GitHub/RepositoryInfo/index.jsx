
import React from 'react'
import Chart from 'chart.js'
import cx from 'classnames'
import { Loading, InfoCard, CardGroup } from 'light-ui'

import github from 'UTILS/github'
import chart from 'UTILS/chart'
import dateHelper from 'UTILS/date'
import locales from 'LOCALES'

import chartStyles from '../styles/chart.css'
import cardStyles from '../styles/info_card.css'
import githubStyles from '../styles/github.css'
import { DOUGHNUT_CONFIG } from 'UTILS/constant/chart'

const githubTexts = locales('github.sections.repos')
const getValidateDate = dateHelper.validator.fullDate

class RepositoryInfo extends React.Component {
  constructor(props) {
    super(props)
    this.reposReviewChart = null
    this.reposForksChart = null
    this.reposStarsChart = null
  }

  componentDidUpdate(preProps) {
    const { commitDatas } = this.props.data
    const preCommits = preProps.data.commitDatas

    if (!preCommits.length && commitDatas.length) {
      this.reposReviewChart && this.reposReviewChart.destroy()
      this.reposReviewChart = null
    }
    this.renderCharts()
  }

  renderCharts() {
    const { ownedRepositories, forkedRepositories } = this.props.data
    if (ownedRepositories.length || forkedRepositories.length) {
      !this.reposForksChart && this.renderReposForksChart()
      ownedRepositories.length && !this.reposStarsChart && this.renderReposStarsChart()
      ownedRepositories.length && !this.reposReviewChart && this.renderReposReviewChart(ownedRepositories.slice(0, 10))
    }
  }

  renderReposForksChart() {
    const { ownedRepositories, forkedRepositories } = this.props.data
    this.reposForksChart = new Chart(this.reposForks, {
      type: 'doughnut',
      data: {
        datasets: [chart.doughnut(
          [ownedRepositories.length, forkedRepositories.length],
          ['rgba(55, 178, 77, 0.9)', 'rgba(135, 181, 143, 0.6)']
        )],
        labels: [
          githubTexts.createdRepos,
          githubTexts.forkedRepos
        ]
      },
      options: DOUGHNUT_CONFIG
    })
  }

  renderReposStarsChart() {
    const { ownedRepositories } = this.props.data
    const datas = []
    const labels = []
    const colors = []
    const standardStarCount = ownedRepositories[0].stargazers_count

    for (const userRepo of ownedRepositories) {
      const { stargazers_count, name } = userRepo
      datas.push(stargazers_count)
      labels.push(name)
      let opacity = stargazers_count / standardStarCount
      opacity = opacity === 1 ? opacity : opacity * 0.8
      colors.push(`rgba(55, 178, 77, ${opacity < 0.1 ? 0.1 : opacity})`)
    }
    this.reposStarsChart = new Chart(this.reposStars, {
      type: 'doughnut',
      data: {
        datasets: [chart.doughnut(datas, colors)],
        labels
      },
      options: DOUGHNUT_CONFIG
    })
  }

  renderReposReviewChart(ownedRepositories) {
    const { commitDatas } = this.props.data
    const datasets = [
      chart.repos.starsDatasets(ownedRepositories),
      chart.repos.forksDatasets(ownedRepositories)
    ]
    if (commitDatas.length) {
      datasets.push(
        chart.repos.commitsDatasets(ownedRepositories, commitDatas)
      )
    }
    this.reposReviewChart = new Chart(this.reposReview, {
      type: 'bar',
      data: {
        datasets,
        labels: github.getReposNames(ownedRepositories)
      },
      options: {
        title: {
          display: true,
          text: githubTexts.chartTitle
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }]
        },
      }
    })
  }

  renderChartInfo() {
    const { ownedRepositories } = this.props.data
    if (!ownedRepositories.length) return null

    const [totalStar, totalFork] = github.getTotalCount(ownedRepositories)
    const maxStaredRepos = ownedRepositories[0]
    const maxTimeRepos = github.longestContributeRepos(ownedRepositories)
    const startTime = maxTimeRepos.created_at.split('T')[0]
    const pushTime = maxTimeRepos.pushed_at.split('T')[0]
    const createdRepos = github.getCreatedRepos(ownedRepositories)

    return (
      <CardGroup className={cardStyles.card_group}>
        <CardGroup>
          <InfoCard
            icon="star-o"
            mainText={totalStar}
            subText={githubTexts.starsCount}
          />
          <InfoCard
            icon="code-fork"
            mainText={totalFork}
            subText={githubTexts.forksCount}
          />
          <InfoCard
            icon="cubes"
            mainText={createdRepos.length}
            subText={githubTexts.reposCount}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            icon="cube"
            tipso={{
              text: githubTexts.popularestReposTip.replace(/\$/, maxStaredRepos.stargazers_count)
            }}
            tipsoTheme="dark"
            mainText={maxStaredRepos.name}
            subText={githubTexts.popularestRepos}
          />
          <InfoCard
            icon="clock-o"
            tipso={{
              text: maxTimeRepos.name
            }}
            tipsoTheme="dark"
            mainText={
              `${getValidateDate(startTime)}~${getValidateDate(pushTime)}`
            }
            subText={githubTexts.longestRepos}
          />
        </CardGroup>
      </CardGroup>
    )
  }

  renderReposReview() {
    const { ownedRepositories, forkedRepositories } = this.props.data
    const { loaded } = this.props;
    const chartContainer = cx(
      githubStyles.repos_chart_container,
      githubStyles.with_chart,
      githubStyles.small_margin
    )
    const totalReposCount = ownedRepositories.length + forkedRepositories.length
    return (
      <div>
        {this.renderChartInfo()}
        {loaded ? (
          <div className={chartContainer}>
            <div className={githubStyles.repos_chart}>
              <canvas
                className={githubStyles.pieChart}
                ref={ref => (this.reposForks = ref)}
              />
              <div className={githubStyles.chart_center}>
                {totalReposCount
                  ? parseInt((ownedRepositories.length * 100) / totalReposCount, 10)
                  : 0
                }%<br />
                {githubTexts.originalRepos}
              </div>
            </div>
            <div className={githubStyles.repos_chart}>
              <canvas
                className={githubStyles.pieChart}
                ref={ref => (this.reposStars = ref)}
              />
              <div className={githubStyles.chart_center}>
                {githubTexts.starPercentage}
              </div>
            </div>
          </div>
        ) : null}
        {ownedRepositories.length ? (
          <div className={chartStyles.canvas_container}>
            <canvas
              className={githubStyles.repos_review}
              ref={ref => (this.reposReview = ref)}
            />
          </div>
        ) : null}
      </div>
    )
  }

  render() {
    const {
      loaded,
      className,
    } = this.props
    const {
      ownedRepositories,
      forkedRepositories,
    } = this.props.data

    let component
    if (!loaded) {
      component = (<Loading loading />)
    } else if (!ownedRepositories.length && !forkedRepositories.length) {
      component = (<div className={cardStyles.empty_card}>{githubTexts.emptyText}</div>)
    } else {
      component = this.renderReposReview()
    }

    return (
      <div className={className}>
        {component}
      </div>
    )
  }
}

RepositoryInfo.defaultProps = {
  className: '',
  data: {
    commitDatas: [],
    forkedRepositories: [],
    ownedRepositories: [],
  },
  loaded: false
}

export default RepositoryInfo
