
import React from 'react'
import cx from 'classnames'
import Chart from 'chart.js'
import objectAssign from 'UTILS/object-assign'
import { Loading, InfoCard, CardGroup } from 'light-ui'

import dateHelper from 'UTILS/date'
import { DAYS, MONTHS, CHART_CONTROLLERS } from 'UTILS/constant'
import { LINE_CONFIG } from 'UTILS/constant/chart'
import {
  getMaxIndex,
  getMaxTarget,
  getFirstMatchTarget
} from 'UTILS/helper'
import locales from 'LOCALES'
import chartStyles from '../styles/chart.css'
import cardStyles from '../styles/info_card.css'
import StockChart from 'COMPONENTS/HighStock'
import { getCommitsStockConfig } from 'UTILS/stock'

const githubTexts = locales('github').sections.commits
const getDateBySeconds = dateHelper.date.bySeconds
const getSecondsByDate = dateHelper.seconds.getByDate

class CommitInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartType: CHART_CONTROLLERS.MONTH.ID
    }
    this.monthlyCommits = []
    this.weeklyCommits = []
    this.dailyCommits = []
    this.commitsWeeklyReviewChart = null
    this.changeChartType = this.changeChartType.bind(this)
  }

  componentDidUpdate() {
    const { loaded } = this.props
    if (!loaded) return
    this.renderCharts()
  }

  changeChartType(type) {
    const { chartType } = this.state
    if (chartType !== type) {
      this.setState({
        chartType: type
      })
    }
  }

  renderCharts() {
    const { commitInfos } = this.props.data
    const { dailyCommits } = commitInfos
    if (dailyCommits.length) {
      !this.commitsWeeklyReviewChart && this.renderWeeklyChart()
    }
  }

  get yearlyChartDatas() {
    const { chartType } = this.state
    const { commitInfos } = this.props.data
    const { commits } = commitInfos

    /* weekly commits chart view */
    if (chartType === CHART_CONTROLLERS.WEEK.ID) {
      if (!this.weeklyCommits.length) {
        this.weeklyCommits = commits.map((commit) => {
          const { total, week } = commit
          return {
            commits: total,
            seconds: week,
            start: getDateBySeconds(week - (7 * 24 * 60 * 60)),
            end: getDateBySeconds(week)
          }
        })
      }
      return {
        commitsData: this.weeklyCommits,
        dateFormat: CHART_CONTROLLERS.WEEK.FORMAT
      }
    }

    /* daily commits chart view */
    if (chartType === CHART_CONTROLLERS.DAY.ID) {
      if (!this.dailyCommits.length) {
        for (const commit of commits) {
          commit.days.forEach((day, dayIndex) => {
            const seconds = commit.week - ((7 - dayIndex) * 24 * 60 * 60)
            const validateDate = getDateBySeconds(seconds)
            this.dailyCommits.push({
              seconds,
              commits: day,
              start: validateDate
            })
          })
        }
      }
      return {
        commitsData: this.dailyCommits,
        dateFormat: CHART_CONTROLLERS.DAY.FORMAT
      }
    }

    /* monthly commits chart view */
    if (!this.monthlyCommits.length) {
      const monthlyCommits = {}

      for (const commit of commits) {
        const endDate = getDateBySeconds(commit.week)
        const [year, month, day] = endDate.split('-')
        const sliceIndex = parseInt(day, 10) < 7 ? (7 - parseInt(day, 10)) : 0

        const thisMonthKey = `${year}-${parseInt(month, 10)}`
        const totalCommits = commit.days
          .slice(sliceIndex)
          .reduce((pre, next) => pre + next, 0)

        const targetCommits = monthlyCommits[thisMonthKey]
        monthlyCommits[thisMonthKey] = Number.isNaN(targetCommits)
          ? totalCommits
          : totalCommits + targetCommits

        if (sliceIndex > 0) {
          const preMonthKey = parseInt(month, 10) - 1 <= 0
            ? `${parseInt(year, 10) - 1}-12`
            : `${year}-${parseInt(month, 10) - 1}`

          const preTotalCommits = commit.days
            .slice(0, sliceIndex)
            .reduce((pre, next) => pre + next, 0)

          const preTargetCommits = monthlyCommits[preMonthKey]
          monthlyCommits[preMonthKey] = Number.isNaN(preTargetCommits)
            ? preTotalCommits
            : preTotalCommits + preTargetCommits
        }
      }

      this.monthlyCommits = Object.keys(monthlyCommits).map((key) => {
        const seconds = getSecondsByDate(key)
        return {
          seconds,
          start: key,
          commits: monthlyCommits[key]
        }
      })
    }
    return {
      commitsData: this.monthlyCommits,
      dateFormat: CHART_CONTROLLERS.MONTH.FORMAT
    }
  }

  renderWeeklyChart() {
    const { commitInfos } = this.props.data
    const { dailyCommits } = commitInfos

    this.commitsWeeklyReviewChart = new Chart(this.commitsWeeklyChart, {
      type: 'line',
      data: {
        labels: DAYS,
        datasets: [objectAssign({}, LINE_CONFIG, {
          data: dailyCommits.map(d => Math.round(d)),
          label: githubTexts.avgCommitTitle
        })]
      },
      options: {
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
          }],
        },
        tooltips: {
          callbacks: {
            label: item => `${item.yLabel} commits`
          }
        }
      }
    })
  }

  renderChartInfo() {
    const { commitDatas, commitInfos } = this.props.data
    const {
      total,
      commits,
      monthReview,
      totalDailyCommits
    } = commitInfos
    // day info
    const maxIndex = getMaxIndex(totalDailyCommits)
    const dayName = DAYS[maxIndex]
    // first commit
    const firstCommitWeek = getFirstMatchTarget(commits, item => item.total)[0]
    const dayIndex = getFirstMatchTarget(
      firstCommitWeek.days, day => day > 0
    )[1]
    const firstCommitDate = getDateBySeconds(
      firstCommitWeek.week - ((7 - dayIndex) * (24 * 60 * 60))
    )

    // max commit repos
    const maxCommitRepos = commitDatas[0]

    // max commits day
    const maxDailyCommitsIndex = getMaxTarget(commits, item => item.days)[1]
    const maxCommitsWeek = commits[maxDailyCommitsIndex]
    const dailyIndex = getMaxIndex(maxCommitsWeek.days)
    const maxCommitDate = getDateBySeconds(
      maxCommitsWeek.week - ((7 - dailyIndex) * (24 * 60 * 60))
    )

    // max repos count month
    const monthlyReposCounts = Object.keys(monthReview).map(
      key => monthReview[key].repos.length
    )
    const maxReposCountMonth = getMaxIndex(monthlyReposCounts) + 1
    const allReposThisMonth = monthReview[maxReposCountMonth].repos.join(', ')

    // max commits month
    const monthlyCommitsCounts = Object.keys(monthReview).map(
      key => monthReview[key].commitsCount
    )
    const maxCommitsCountMonth = getMaxIndex(monthlyCommitsCounts) + 1
    const maxCommitsCount = monthReview[maxCommitsCountMonth].commitsCount

    return (
      <CardGroup className={cardStyles.card_group}>
        <CardGroup>
          <InfoCard
            tipsoTheme="dark"
            mainText={dayName}
            subText={githubTexts.maxDay}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={(total / commits.length).toFixed(2)}
            subText={githubTexts.averageCount}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={firstCommitDate}
            subText={githubTexts.firstCommit}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={maxCommitDate}
            subText={githubTexts.maxCommitDate}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            tipso={{
              text: githubTexts.maxCommitReposTip.replace(/\$/, maxCommitRepos.totalCommits)
            }}
            tipsoTheme="dark"
            mainText={maxCommitRepos.name}
            subText={githubTexts.maxCommitRepos}
          />
          <InfoCard
            tipso={{
              style: {
                width: '250px'
              },
              text: `${githubTexts.maxReposCountMonthTip.replace(/\$/, allReposThisMonth)}`
            }}
            tipsoTheme="dark"
            mainText={MONTHS[maxReposCountMonth]}
            subText={githubTexts.maxReposCountMonth}
          />
          <InfoCard
            tipso={{
              text: `${githubTexts.maxCommitsCountMonthTip.replace(/\$/, maxCommitsCount)}`
            }}
            tipsoTheme="dark"
            mainText={MONTHS[maxCommitsCountMonth]}
            subText={githubTexts.maxCommitsCountMonth}
          />
        </CardGroup>
      </CardGroup>
    )
  }

  renderChartControllers() {
    const controllers = []
    const { chartType } = this.state
    const chartTypeKeys = Object.keys(CHART_CONTROLLERS)

    chartTypeKeys.forEach((key, i) => {
      const {
        ID,
        TEXT,
      } = CHART_CONTROLLERS[key]
      const isActive = ID === chartType
      const onClick = isActive
        ? Function.prototype
        : () => this.changeChartType(ID)

      controllers.push((
        <span
          key={controllers.length}
          className={cx(
            chartStyles.chart_controller,
            isActive && chartStyles.controller_active
          )}
          onClick={onClick}
        >
          {TEXT}
        </span>
      ))
      if (i !== chartTypeKeys.length - 1) {
        controllers.push((
          <span key={controllers.length}>
            &nbsp;/&nbsp;
          </span>
        ))
      }
    })

    return (
      <div className={chartStyles.chart_controllers}>
        {controllers}
      </div>
    )
  }

  renderCommitsReview() {
    const { commitsData, dateFormat } = this.yearlyChartDatas

    return (
      <div>
        {this.renderChartInfo()}
        <div className={chartStyles.canvas_container}>
          <canvas
            id="commits_weekly_review"
            ref={ref => (this.commitsWeeklyChart = ref)}
          />
        </div>
        <div className={chartStyles.canvas_container}>
          {this.renderChartControllers()}
          <StockChart
            data={commitsData}
            config={getCommitsStockConfig({
              dateFormat,
              commitsData
            })}
          />
        </div>
      </div>
    )
  }

  render() {
    const { loaded, className } = this.props
    const { commitDatas } = this.props.data

    let component
    if (!loaded) {
      component = (<Loading loading />)
    } else if (commitDatas.length === 0) {
      component = (
        <div className={cardStyles.empty_card}>{githubTexts.emptyText}</div>
      )
    } else {
      component = this.renderCommitsReview()
    }

    return (
      <div className={className}>
        {component}
      </div>
    )
  }
}

CommitInfo.defaultProps = {
  loaded: false,
  className: '',
  data: {
    commitInfos: {},
    commitDatas: [],
  }
}

export default CommitInfo
