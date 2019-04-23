
import React from 'react'
import PropTypes from 'prop-types'
import Chart from 'chart.js'
import cx from 'classnames'
import objectAssign from 'UTILS/object-assign'
import { Tipso, Label } from 'light-ui'

import Icon from 'COMPONENTS/Icon'
import styles from '../styles/github.css'
import cardStyles from '../styles/info_card.css'
import dateHelper from 'UTILS/date'
import { LINE_CONFIG } from 'UTILS/constant/chart'
import locales from 'LOCALES'
import { contributionLevel } from './helper'
import ReposBaseInfo from '../ReposBaseInfo'

const githubTexts = locales('github.sections.orgs')

class ContributionChart extends React.Component {
  constructor(props) {
    super(props)
    this.contributionReviewChart = null
  }

  componentDidMount() {
    this.renderCharts()
  }

  componentDidUpdate() {
    this.renderCharts()
  }

  renderCharts() {
    const { contribution } = this.props
    if (contribution) {
      if (!this.contributionReviewChart) {
        return this.renderContributionChart(contribution.weeks)
      }
      return this.updateCharts(contribution.weeks)
    }
  }

  updateCharts(contributions) {
    const data = []
    const labels = []

    for (const contribution of contributions) {
      data.push(contribution.data)
      labels.push(dateHelper.date.bySeconds(contribution.week))
    }
    this.contributionReviewChart.data.labels = labels
    this.contributionReviewChart.data.datasets[0].data = data
    this.contributionReviewChart.update()
  }

  renderContributionChart(contributions) {
    const data = []
    const labels = []

    for (const contribution of contributions) {
      data.push(contribution.data)
      labels.push(dateHelper.date.bySeconds(contribution.week))
    }
    this.contributionReviewChart = new Chart(this.contributionChart, {
      type: 'line',
      data: {
        labels,
        datasets: [objectAssign({}, LINE_CONFIG, {
          data,
          label: '',
          pointHoverRadius: 2,
          pointHoverBorderWidth: 2,
          pointHitRadius: 2,
          pointBorderWidth: 0,
          pointRadius: 0,
          // borderColor: GREEN_COLORS[4],
        })]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: ''
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true
            }
          }],
        }
      }
    })
  }

  renderContributionDates() {
    const { contribution, repository, percentage } = this.props
    if (!contribution.weeks.length) return null
    // commit dates
    const { weeks } = contribution
    const startDate = dateHelper.date.bySeconds(weeks[0].week)
    const endDate = dateHelper.date.bySeconds(weeks.slice(-1)[0].week)
    // repos info
    const {
      name,
      fork,
      language,
      html_url,
      forks_count,
      description,
      watchers_count,
      stargazers_count
    } = repository

    return (
      <div className={styles.repos_details}>
        <div className={styles.contribution_dates}>
          <div className={styles.contribution_date}>{startDate}</div>
          <div className={styles.contribution_date}>{endDate}</div>
        </div>
        <div className={styles.org_repos_infos}>
          <div className={styles.org_repos_info}>
            <a
              className={styles.repos_title}
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </a>
            &nbsp;&nbsp;
            {fork ? (
              <Label
                min
                icon="code-fork"
                text="forked"
                color="darkLight"
                clickable={false}
              />
            ) : null}
          </div>
          <div className={styles.org_repos_info}>
            <ReposBaseInfo
              stargazers={stargazers_count}
              forks={forks_count}
              watchers={watchers_count}
            />
            &nbsp;&nbsp;&nbsp;
            <Icon icon="code" />
            &nbsp;{language || 'NULL'}
            &nbsp;&nbsp;&nbsp;
            {percentage > 30 ? (
              <Tipso
                theme="dark"
                className={cx(cardStyles.card_tipso, styles.info_tipso)}
                tipsoContent={(<span>{githubTexts.coreDeveloperIntro}</span>)}
              >
                <span
                  className={cx(
                    styles.info_strong,
                    styles[`strong-${contributionLevel(percentage)}`]
                  )}
                >
                  <Icon icon="trophy" />
                  &nbsp;{githubTexts.coreDeveloper}
                </span>
              </Tipso>
            ) : null}
          </div>
          {description ? (
            <div className={styles.org_repos_desc_info}>
              <blockquote>{description}</blockquote>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.contributions_chart_container}>
        <div className={styles.chart_container}>
          <canvas ref={ref => (this.contributionChart = ref)} />
        </div>
        {this.renderContributionDates()}
      </div>
    )
  }
}

ContributionChart.propTypes = {
  contribution: PropTypes.object,
  repository: PropTypes.object,
}

ContributionChart.defaultProps = {
  contribution: {
    weeks: []
  },
  repository: {}
}

export default ContributionChart
