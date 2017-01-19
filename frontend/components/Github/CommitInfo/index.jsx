import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import cx from 'classnames';
import Chart from 'chart.js';
import objectAssign from 'object-assign';

import github from 'UTILS/github';
import {
  getDateBySeconds,
  getDateAfterDays
} from 'UTILS/date';
import { DAYS, LINECHART_CONFIG } from 'UTILS/const_value';
import {
  sortRepos,
  getMaxIndex,
  getFirstTarget
} from 'UTILS/helper';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';

import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';

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
    const { commitDatas } = this.props;
    const { commits, dailyCommits } = commitDatas;
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
      dateLabels.push(getDateBySeconds(item.week));
    });
    this.commitsYearlyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: commitDates,
          label: '单周提交数',
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
              return `${item[0].xLabel} ~ ${getDateAfterDays(7, item[0].xLabel)}`
            },
            label: (item, data) => {
              return `当周提交数：${item.yLabel}`
            }
          }
        }
      }
    })
  }

  renderWeeklyChart(dailyCommits) {
    const commits = dailyCommits.slice(1);
    commits.push(dailyCommits[0]);
    const days = DAYS.slice(1);
    days.push(DAYS[0])
    const commitsChart = ReactDOM.findDOMNode(this.commitsWeeklyChart);
    this.commitsWeeklyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: days,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data: commits,
          label: '每日总提交数',
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
              return `总提交数 ${item.yLabel}，平均每周${item.xLabel.slice(-1)}提交 ${(item.yLabel / 52).toFixed(2)} 次`
            }
          }
        }
      }
    });
  }

  renderChartInfo() {
    const { commitDatas, reposCommits } = this.props;
    const { commits, dailyCommits, total } = commitDatas;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstTarget(commits, (item) => item.total);
    const week = getDateBySeconds(firstCommitWeek.week);
    const [firstCommitDay, dayIndex] = getFirstTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = getDateAfterDays(dayIndex, week);
    // max commit repos
    reposCommits.sort(sortRepos('totalCommits'));
    const maxCommitRepos = reposCommits[0];

    return (
      <div className={chartStyles["chart_info_container"]}>
        <ChartInfo
          mainText={dayName}
          subText="是你提交最多的日子"
        />
        <ChartInfo
          mainText={(total / 52).toFixed(2)}
          subText="平均每周提交次数"
        />
        <ChartInfo
          mainText={firstCommitDate}
          subText="2016年第一次提交"
        />
        <ChartInfo
          mainText={maxCommitRepos.name}
          subText="提交次数最多的仓库"
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
      <div className={cardStyles["info_card_container"]}>
        <p><i aria-hidden="true" className="fa fa-git"></i>&nbsp;&nbsp;贡献信息</p>
        <div className={cardStyles["info_card"]}>
          { !hasCommits ? (
            <Loading />
          ) : this.renderCommitsReview()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { commitDatas, loaded } = state.github;
  return {
    loaded,
    reposCommits: commitDatas,
    commitDatas: github.combineReposCommits(commitDatas),
    hasCommits: commitDatas.length > 0,
  }
}

export default connect(mapStateToProps)(CommitInfo);
