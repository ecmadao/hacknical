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
  getMaxTarget,
  getFirstMatchTarget
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
          pointBorderWidth: 0,
          pointRadius: 0,
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
    // const commits = [...dailyCommits.slice(1)];
    // commits.push(dailyCommits[0]);
    // const days = DAYS.slice(1);
    // days.push(DAYS[0]);
    const commitsChart = ReactDOM.findDOMNode(this.commitsWeeklyChart);
    this.commitsWeeklyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: DAYS,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: dailyCommits,
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
              return `${item.yLabel} commits`
            }
          }
        }
      }
    });
  }

  renderChartInfo() {
    const { commitDatas, commitInfos } = this.props;
    const { commits, dailyCommits, total } = commitInfos;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstMatchTarget(commits, (item) => item.total);
    const [firstCommitDay, dayIndex] = getFirstMatchTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = dateHelper.date.bySeconds(firstCommitWeek.week + dayIndex * 24 * 60 * 60);
    // max commit repos
    commitDatas.sort(sortRepos('totalCommits'));
    const maxCommitRepos = commitDatas[0];

    // max commits day
    const [maxDailyCommits, maxDailyCommitsIndex] = getMaxTarget(commits, item => item.days);
    const maxCommitsWeek = commits[maxDailyCommitsIndex];
    const dailyIndex = getMaxIndex(maxCommitsWeek.days);
    const maxCommitDate = dateHelper.date.bySeconds(maxCommitsWeek.week + dailyIndex * 24 * 60 * 60);

    return (
      <div>
        <div className={chartStyles["chart_info_container"]}>
          <ChartInfo
            mainText={dayName}
            subText={githubTexts.maxDay}
          />
          <ChartInfo
            mainText={(total / commits.length).toFixed(2)}
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
        <div className={chartStyles["chart_info_container"]}>
          <ChartInfo
            mainText={maxCommitDate}
            subText={githubTexts.maxCommitDate}
          />
          <ChartInfo
            mainText={maxDailyCommits}
            subText={githubTexts.maxDailyCommits}
          />
        </div>
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
    const { hasCommits, loaded, className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading />);
    } else {
      if (!hasCommits) {
        component = (<div className={cardStyles["empty_card"]}>{githubTexts.emptyText}</div>);
      } else {
        component = this.renderCommitsReview();
      }
    }
    return (
      <div className={cx(cardStyles["info_card"], className)}>
        {component}
      </div>
    )
  }
}

CommitInfo.defaultProps = {
  loaded: false,
  hasCommits: false,
  className: '',
  commitInfos: {},
  commitDatas: []
};

export default CommitInfo;
