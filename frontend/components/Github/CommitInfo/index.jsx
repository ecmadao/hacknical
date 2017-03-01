import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Chart from 'chart.js';
import objectAssign from 'object-assign';

import github from 'UTILS/github';
import dateHelper from 'UTILS/date';
import { DAYS, LINECHART_CONFIG } from 'UTILS/const_value';
import {
  sortRepos,
  getMaxIndex,
  getFirstTarget
} from 'UTILS/helper';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import locales from 'LOCALES';

import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';

const githubTexts = locales('github').sections.commits;

class CommitInfo extends React.Component {
  constructor(props) {
    super(props);
    this.commitsWeeklyReviewChart = null;
    this.commitsYearlyReviewChart = null;
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
  }

  renderCharts() {
    const { loaded, commitInfos } = this.props;
    if (!loaded) { return }
    const { commits, dailyCommits } = commitInfos;
    if (dailyCommits.length) {
      !this.commitsWeeklyReviewChart && this.renderWeeklyChart(dailyCommits);
    }
    if (commits.length) {
      !this.commitsYearlyReviewChart && this.renderYearlyChart(commits);
    }
  }

  renderYearlyChart(commits) {
    const commitsChart = ReactDOM.findDOMNode(this.commitsYearlyChart);
    const commitDates = [];
    const dateLabels = [];
    commits.forEach((item) => {
      commitDates.push(item.total);
      dateLabels.push(dateHelper.date.bySeconds(item.week));
    });
    this.commitsYearlyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: commitDates,
          label: githubTexts.weeklyCommitChartTitle,
        })]
      },
      options: {
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display:false
            }
          }],
          yAxes: [{
            gridLines: {
              display:false
            },
            ticks: {
              beginAtZero:true
            }
          }],
        },
        tooltips: {
          callbacks: {
            title: (item, data) => {
              return `${item[0].xLabel} ~ ${dateHelper.date.afterDays(7, item[0].xLabel)}`
            },
            label: (item, data) => {
              return `${item.yLabel} commits this week`
            }
          }
        }
      }
    })
  }

  renderWeeklyChart(dailyCommits) {
    const commits = [...dailyCommits.slice(1)];
    commits.push(dailyCommits[0]);
    const days = DAYS.slice(1);
    days.push(DAYS[0]);
    const commitsChart = ReactDOM.findDOMNode(this.commitsWeeklyChart);
    this.commitsWeeklyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: days,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: commits,
          label: githubTexts.dailyCommitChartTitle,
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
              beginAtZero:true
            }
          }],
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `${item.yLabel} commits totally`
            }
          }
        }
      }
    });
  }

  renderChartInfo() {
    const { commitDatas, commitInfos } = this.props;
    // const commitInfo = this.commitInfo;
    const { commits, dailyCommits, total } = commitInfos;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstTarget(commits, (item) => item.total);
    const [firstCommitDay, dayIndex] = getFirstTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = dateHelper.date.bySeconds(firstCommitWeek.week + dayIndex * 24 * 60 * 60);
    // max commit repos
    commitDatas.sort(sortRepos('totalCommits'));
    const maxCommitRepos = commitDatas[0];

    return (
      <div className={chartStyles["chart_info_container"]}>
        <ChartInfo
          mainText={dayName}
          subText={githubTexts.maxDay}
        />
        <ChartInfo
          mainText={(total / 52).toFixed(2)}
          subText={githubTexts.averageCount}
        />
        <ChartInfo
          mainText={firstCommitDate}
          subText={githubTexts.firstCommit}
        />
        <ChartInfo
          mainText={maxCommitRepos.name}
          subText={githubTexts.maxCommitRepos}
        />
      </div>
    )
  }

  renderCommitsReview() {
    return (
      <div>
        {this.renderChartInfo()}
        <div className={chartStyles["canvas_container"]}>
          <canvas id="commits_weekly_review" ref={ref => this.commitsWeeklyChart = ref}></canvas>
        </div>
        <div className={chartStyles["canvas_container"]}>
          <canvas id="commits_yearly_review" ref={ref => this.commitsYearlyChart = ref}></canvas>
        </div>
      </div>
    )
  }

  render() {
    const { hasCommits, loaded } = this.props;
    if (loaded && !hasCommits) {
      return (<div></div>)
    }
    return (
      <div className={cardStyles["info_card"]}>
        { !hasCommits ? (
          <Loading />
        ) : this.renderCommitsReview()}
      </div>
    )
  }
}

export default CommitInfo;
