import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';

import github from 'UTILS/github';
import { BLUE_COLORS } from 'UTILS/colors';
import {
  getDateBySeconds,
  getDateAfterDays
} from 'UTILS/date';
import { DAYS } from 'UTILS/const_value';
import {
  getMaxIndex,
  getFirstTarget
} from 'UTILS/helper';
import githubActions from '../redux/actions';
import ChartInfo from './ChartInfo';


class UserCommitCard extends React.Component {
  constructor(props) {
    super(props);
    this.commitsWeeklyReviewChart = null;
    this.commitsYearlyReviewChart = null;
  }

  componentDidMount() {
    const {actions, commitDatas} = this.props;
    this.renderCharts();
    if (!commitDatas.length) {
      actions.fetchGithubCommits();
    }
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
        datasets: [{
          data: commitDates,
          label: '单周提交数',
          fill: true,
          lineTension: 0.1,
          backgroundColor: BLUE_COLORS[3],
          borderColor: BLUE_COLORS[0],
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: BLUE_COLORS[0],
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: BLUE_COLORS[0],
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          spanGaps: false,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display:false
            }
          }],
          // yAxes: [{
          //   gridLines: {
          //     display:false
          //   }
          // }],
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
        datasets: [{
          data: commits,
          label: '每日总提交数',
          fill: true,
          lineTension: 0.1,
          backgroundColor: BLUE_COLORS[3],
          borderColor: BLUE_COLORS[0],
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: BLUE_COLORS[0],
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: BLUE_COLORS[0],
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          spanGaps: false,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            gridLines: {
              display:false
            }
          }],
          // yAxes: [{
          //   gridLines: {
          //     display:false
          //   }
          // }],
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `总提交数 ${item.yLabel}，平均每周${item.xLabel.slice(-1)}提交 ${parseInt(item.yLabel / 52)} 次`
            }
          }
        }
      }
    });
  }

  renderChartInfo() {
    const { commitDatas } = this.props;

    const { commits, dailyCommits, total } = commitDatas;
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];

    const [firstCommitWeek, firstCommitIndex] = getFirstTarget(commits, (item) => item.total);
    const week = getDateBySeconds(firstCommitWeek.week);
    const [firstCommitDay, dayIndex] = getFirstTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = getDateAfterDays(dayIndex, week);

    return (
      <div className="chart_info_container">
        <ChartInfo
          mainText={dayName}
          subText="是你提交最多的日子"
        />
        <ChartInfo
          mainText={parseInt(total / 52, 10)}
          subText="平均每周提交次数"
        />
        <ChartInfo
          mainText={firstCommitDate}
          subText="2016年第一次提交"
        />
      </div>
    )
  }

  render() {
    const { loaded } = this.props;
    return (
      <div className="info_card_container">
        <p><i aria-hidden="true" className="fa fa-git"></i>&nbsp;&nbsp;贡献信息</p>
        <div className="info_card card chart_card">
          {loaded ? this.renderChartInfo() : ''}
          <canvas id="commits_weekly_review" ref={ref => this.commitsWeeklyChart = ref}></canvas>
          <canvas id="commits_yearly_review" ref={ref => this.commitsYearlyChart = ref}></canvas>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { commitDatas } = state.github;
  return {
    commitDatas: github.combineReposCommits(commitDatas),
    loaded: commitDatas.length > 0
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCommitCard);
