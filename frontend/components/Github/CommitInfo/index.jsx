import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Chart from 'chart.js';
import objectAssign from 'object-assign';
import { Loading, InfoCard, CardGroup } from 'light-ui';

import dateHelper from 'UTILS/date';
import { DAYS, MONTHS } from 'UTILS/const_value';
import { LINE_CONFIG } from 'SHARED/datas/chart_config';
import {
  sortRepos,
  getMaxIndex,
  getMaxTarget,
  getFirstMatchTarget
} from 'UTILS/helper';
import locales from 'LOCALES';
import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';

const githubTexts = locales('github').sections.commits;
const getDateBySeconds = dateHelper.date.bySeconds;

class CommitInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: 'month'
    };
    this.monthlyCommits = null;
    this.weeklyCommits = null;
    this.dailyCommits = null;
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

    /* weekly commits chart view */
    if (chartType === 'week') {
      if (this.weeklyCommits) { return this.weeklyCommits }
      commits.forEach((item, index) => {
        commitDates.push(item.total);
        dateLabels.push(
          `${getDateBySeconds(item.week - 7 * 24 * 60 * 60)} ~ ${getDateBySeconds(item.week)}`
        );
      });
      this.weeklyCommits = {
        commitDates,
        dateLabels
      };
      return this.weeklyCommits;
    }

    /* daily commits chart view */
    if (chartType === 'day') {
      if (this.dailyCommits) { return this.dailyCommits }
      commits.forEach((item, index) => {
        item.days.forEach((day, dayIndex) => {
          commitDates.push(day);
          const date = getDateBySeconds(item.week - (7 - dayIndex) * 24 * 60 * 60);
          dateLabels.push(date);
        });
      });
      this.dailyCommits = {
        commitDates,
        dateLabels
      };
      return this.dailyCommits;
    }

    /* monthly commits chart view */
    if (this.monthlyCommits) { return this.monthlyCommits }
    const monthlyCommits = {};
    commits.forEach((item) => {
      const endDate = getDateBySeconds(item.week);
      const [year, month, day] = endDate.split('-');
      const sliceIndex = parseInt(day, 10) < 7 ? (7 - parseInt(day, 10)) : 0;

      const thisMonthKey = `${year}-${parseInt(month, 10)}`;
      const totalCommits = item.days.slice(sliceIndex).reduce((pre, next) => pre + next, 0);
      const targetCommits = monthlyCommits[thisMonthKey];
      monthlyCommits[thisMonthKey] = isNaN(targetCommits) ? totalCommits : totalCommits + targetCommits;

      if (sliceIndex > 0) {
        const preMonthKey = parseInt(month, 10) - 1 <= 0 ?
          `${parseInt(year, 10) - 1}-12` :
          `${year}-${parseInt(month, 10) - 1}`;
        const preTotalCommits = item.days.slice(0, sliceIndex).reduce((pre, next) => pre + next, 0);
        const preTargetCommits = monthlyCommits[preMonthKey];
        monthlyCommits[preMonthKey] = isNaN(preTargetCommits) ? preTotalCommits : preTotalCommits + preTargetCommits;
      }
    });

    Object.keys(monthlyCommits).forEach((key) => {
      commitDates.push(monthlyCommits[key]);
      dateLabels.push(key);
    });
    this.monthlyCommits = {
      commitDates,
      dateLabels
    };
    return this.monthlyCommits;
  }

  updateYearlyChart() {
    const { chartType } = this.state;
    const { commitDates, dateLabels } = this.yearlyChartDatas;
    this.commitsYearlyReviewChart.data.labels = dateLabels;
    this.commitsYearlyReviewChart.data.datasets[0].data = commitDates;
    this.commitsYearlyReviewChart.data.datasets[0].pointBorderWidth = chartType === 'day' ? 0 : 2;
    this.commitsYearlyReviewChart.data.datasets[0].pointRadius = chartType === 'day' ? 0 : 3;
    this.commitsYearlyReviewChart.update();
  }

  renderYearlyChart() {
    const commitsChart = ReactDOM.findDOMNode(this.commitsYearlyChart);
    const { commitDates, dateLabels } = this.yearlyChartDatas;

    this.commitsYearlyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [objectAssign({}, LINE_CONFIG, {
          data: commitDates,
          label: githubTexts.weeklyCommitChartTitle
        })]
      },
      options: {
        animation: false,
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
    });
  }

  renderWeeklyChart() {
    const { commitInfos } = this.props;
    const { dailyCommits } = commitInfos;
    const commitsChart = ReactDOM.findDOMNode(this.commitsWeeklyChart);
    this.commitsWeeklyReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: DAYS,
        datasets: [objectAssign({}, LINE_CONFIG, {
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
    const allReposThisMonth = monthReview[maxReposCountMonth].repos.join(', ');

    // max commits month
    const monthlyCommitsCounts = Object.keys(monthReview).map(key => monthReview[key].commitsCount);
    const maxCommitsCountMonth = getMaxIndex(monthlyCommitsCounts) + 1;
    const maxCommitsCount = monthReview[maxCommitsCountMonth].commitsCount;

    return (
      <CardGroup className={cardStyles['card_group']}>
        <CardGroup>
          <InfoCard
            mainText={dayName}
            subText={githubTexts.maxDay}
          />
          <InfoCard
            mainText={(total / commits.length).toFixed(2)}
            subText={githubTexts.averageCount}
          />
          <InfoCard
            mainText={firstCommitDate}
            subText={githubTexts.firstCommit}
          />
          <InfoCard
            mainText={maxCommitDate}
            subText={githubTexts.maxCommitDate}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            tipso={{
              text: githubTexts.maxCommitReposTip.replace(/\$/, maxCommitRepos.totalCommits)
            }}
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
            mainText={MONTHS[maxReposCountMonth]}
            subText={githubTexts.maxReposCountMonth}
          />
          <InfoCard
            tipso={{
              text: `${githubTexts.maxCommitsCountMonthTip.replace(/\$/, maxCommitsCount)}`
            }}
            mainText={MONTHS[maxCommitsCountMonth]}
            subText={githubTexts.maxCommitsCountMonth}
          />
        </CardGroup>
      </CardGroup>
    );
  }

  renderCommitsReview() {
    const { chartType } = this.state;
    const { commitInfos } = this.props;
    const { commits } = commitInfos;
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
                chartType === 'month' && chartStyles["controller_active"]
              )}
              onClick={() => this.changeChartType('month')}>
              {githubTexts.monthlyView}
            </span>
            &nbsp;/&nbsp;
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
          {commits && commits.length ? (
            <div className={chartStyles["chart_bottom_container"]}>
              <div className={chartStyles["chart_bottom"]}>
                {getDateBySeconds(commits[0].week - 7 * 24 * 60 * 60)}
              </div>
              <div className={chartStyles["chart_bottom"]}>
                {getDateBySeconds(commits[commits.length - 1].week)}
              </div>
            </div>
          ) : ''}
        </div>
      </div>
    );
  }

  render() {
    const { hasCommits, loaded, className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading={true} />);
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
    );
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
