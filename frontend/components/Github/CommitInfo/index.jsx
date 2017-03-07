import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Chart from 'chart.js';
import objectAssign from 'object-assign';

import github from 'UTILS/github';
import dateHelper from 'UTILS/date';
import { DAYS, MONTHS, LINECHART_CONFIG } from 'UTILS/const_value';
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
const getDateBySeconds = dateHelper.date.bySeconds;


class CommitInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 'week'
    };
    this.commitsWeeklyReviewChart = null;
    this.commitsYearlyReviewChart = null;
    this.changeChartType = this.changeChartType.bind(this);
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate(preProps, preState) {
    const { loaded } = this.props;
    const { chartType } = this.state;
    if (chartType !== preState.chartType && loaded) {
      this.commitsYearlyReviewChart && this.updateYearlyChart();
    } else {
      this.renderCharts();
    }
  }

  changeChartType(type) {
    const { chartType } = this.state;
    if (chartType !== type) {
      this.setState({
        chartType: type
      });
    }
  }

  renderCharts() {
    const { loaded, commitInfos } = this.props;
    if (!loaded) { return }
    const { commits, dailyCommits } = commitInfos;
    if (dailyCommits.length) {
      !this.commitsWeeklyReviewChart && this.renderWeeklyChart();
    }
    if (commits.length) {
      !this.commitsYearlyReviewChart && this.renderYearlyChart();
    }
  }

  get yearlyChartDatas() {
    const { chartType } = this.state;
    const { commitInfos } = this.props;
    const { commits } = commitInfos;
    const commitDates = [];
    const dateLabels = [];

    if (chartType === 'week') {
      commits.forEach((item) => {
        commitDates.push(item.total);
        dateLabels.push(getDateBySeconds(item.week));
      });
    } else {
      commits.forEach((item) => {
        item.days.forEach((day, dayIndex) => {
          commitDates.push(day);
          const date = getDateBySeconds(item.week - (7 - dayIndex) * 24 * 60 * 60);
          dateLabels.push(date);
        });
      });
    }
    return [commitDates, dateLabels];
  }

  updateYearlyChart() {
    const [commitDates, dateLabels] = this.yearlyChartDatas;
    this.commitsYearlyReviewChart.data.labels = dateLabels;
    this.commitsYearlyReviewChart.data.datasets[0].data = commitDates;
    this.commitsYearlyReviewChart.update();
  }

  renderYearlyChart() {
    const commitsChart = ReactDOM.findDOMNode(this.commitsYearlyChart);
    const [commitDates, dateLabels] = this.yearlyChartDatas;

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
        }
      }
    })
  }

  renderWeeklyChart() {
    const { commitInfos } = this.props;
    const { dailyCommits } = commitInfos;
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
    const { commits, dailyCommits, total, monthReview } = commitInfos;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstMatchTarget(commits, (item) => item.total);
    const [firstCommitDay, dayIndex] = getFirstMatchTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = getDateBySeconds(firstCommitWeek.week - (7 - dayIndex) * 24 * 60 * 60);
    // max commit repos
    commitDatas.sort(sortRepos('totalCommits'));
    const maxCommitRepos = commitDatas[0];

    // max commits day
    const [maxDailyCommits, maxDailyCommitsIndex] = getMaxTarget(commits, item => item.days);
    const maxCommitsWeek = commits[maxDailyCommitsIndex];
    const dailyIndex = getMaxIndex(maxCommitsWeek.days);
    const maxCommitDate = getDateBySeconds(maxCommitsWeek.week - (7 - dailyIndex) * 24 * 60 * 60);

    // max repos count month
    const monthlyReposCounts = Object.keys(monthReview).map(key => monthReview[key].repos.length);
    const maxReposCountMonth = getMaxIndex(monthlyReposCounts) + 1;

    // max commits month
    const monthlyCommitsCounts = Object.keys(monthReview).map(key => monthReview[key].commitsCount);
    const maxCommitsCountMonth = getMaxIndex(monthlyCommitsCounts) + 1;
    // getMaxIndex
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
            mainText={maxCommitDate}
            subText={githubTexts.maxCommitDate}
          />
        </div>
        <div className={chartStyles["chart_info_container"]}>
          <ChartInfo
            mainText={maxCommitRepos.name}
            subText={githubTexts.maxCommitRepos}
          />
          <ChartInfo
            mainText={MONTHS[maxReposCountMonth]}
            subText={`${MONTHS[maxReposCountMonth]}${githubTexts.maxReposCountMonth}`}
          />
          <ChartInfo
            mainText={MONTHS[maxCommitsCountMonth]}
            subText={`${MONTHS[maxCommitsCountMonth]}${githubTexts.maxCommitsCountMonth}`}
          />
        </div>
      </div>
    )
  }

  renderCommitsReview() {
    const { chartType } = this.state;
    return (
      <div>
        {this.renderChartInfo()}
        <div className={chartStyles["canvas_container"]}>
          <canvas id="commits_weekly_review" ref={ref => this.commitsWeeklyChart = ref}></canvas>
        </div>
        <div className={chartStyles["canvas_container"]}>
          <div className={chartStyles["chart_controllers"]}>
            <span
              className={cx(
                chartStyles["chart_controller"],
                chartType === 'week' && chartStyles["controller_active"]
              )}
              onClick={() => this.changeChartType('week')}>
              {githubTexts.weeklyView}
            </span>
            &nbsp;/&nbsp;
            <span
              className={cx(
                chartStyles["chart_controller"],
                chartType === 'day' && chartStyles["controller_active"]
              )}
              onClick={() => this.changeChartType('day')}>
              {githubTexts.dailyView}
            </span>
          </div>
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
