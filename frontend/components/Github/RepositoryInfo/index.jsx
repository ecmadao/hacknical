import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import cx from 'classnames';
import { Loading, InfoCard, CardGroup } from 'light-ui';

import github from 'UTILS/github';
import chart from 'UTILS/chart';
import dateHelper from 'UTILS/date';
import locales from 'LOCALES';

import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';
import githubStyles from '../styles/github.css';

const githubTexts = locales('github').sections.repos;
const getValidateDate = dateHelper.validator.fullDate;
const CHART_OPTIONS = {
  responsive: true,
  title: {
    display: true,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [{
      display: false,
      gridLines: {
        display:false
      }
    }],
    yAxes: [{
      display: false,
      gridLines: {
        display:false
      }
    }],
  }
};

class RepositoryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.reposReviewChart = null;
    this.reposForksChart = null;
    this.reposStarsChart = null;
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
    const { commitDatas, userRepos } = this.props;
    if (commitDatas.length && userRepos.length && !preProps.commitDatas.length) {
      this.renderReposReviewChart(userRepos.slice(0, 10));
    }
  }

  renderCharts() {
    const { userRepos, forkedRepos } = this.props;
    if (userRepos.length || forkedRepos.length) {
      !this.reposReviewChart && this.renderReposReviewChart(userRepos.slice(0, 10));
      !this.reposForksChart && this.renderReposForksChart();
      !this.reposStarsChart && this.renderReposStarsChart();
    }
  }

  renderReposForksChart() {
    const { userRepos, forkedRepos } = this.props;
    const reposForks = ReactDOM.findDOMNode(this.reposForks);
    this.reposForksChart = new Chart(reposForks, {
      type: 'doughnut',
      data: {
        datasets: [chart.doughnut(
          [userRepos.length, forkedRepos.length],
          ['rgba(55, 178, 77, 0.9)', 'rgba(135, 181, 143, 0.6)']
        )],
        labels: [githubTexts.createdRepos, githubTexts.forkedRepos]
      },
      options: CHART_OPTIONS
    });
  }

  renderReposStarsChart() {
    const { userRepos, forkedRepos } = this.props;
    const reposStars = ReactDOM.findDOMNode(this.reposStars);
    const datas = [], labels = [], colors = [];
    const standardStarCount = userRepos[0].stargazers_count;

    userRepos.forEach((userRepo) => {
      const { stargazers_count, name } = userRepo;
      datas.push(stargazers_count);
      labels.push(name);
      let opacity = stargazers_count / standardStarCount;
      opacity = opacity === 1 ? opacity : opacity * 0.8;
      colors.push(`rgba(55, 178, 77, ${ opacity < 0.1 ? 0.1 : opacity })`)
    });
    this.reposStarsChart = new Chart(reposStars, {
      type: 'doughnut',
      data: {
        datasets: [chart.doughnut(datas, colors)],
        labels
      },
      options: CHART_OPTIONS
    });
  }

  renderReposReviewChart(userRepos) {
    const { commitDatas } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    const datasets = [
      chart.repos.starsDatasets(userRepos),
      chart.repos.forksDatasets(userRepos)
    ];
    if (commitDatas.length) {
      datasets.push(
        chart.repos.commitsDatasets(userRepos, commitDatas)
      );
    }
    this.reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        datasets,
        labels: github.getReposNames(userRepos)
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
    });
  }

  renderChartInfo() {
    const { userRepos } = this.props;

    const [totalStar, totalFork] = github.getTotalCount(userRepos);
    const maxStaredRepos = userRepos[0];
    const maxTimeRepos = github.longestContributeRepos(userRepos);
    const startTime = maxTimeRepos['created_at'].split('T')[0];
    const pushTime = maxTimeRepos['pushed_at'].split('T')[0];
    const yearlyRepos = github.getYearlyRepos(userRepos);

    return (
      <CardGroup className={cardStyles['card_group']}>
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
            mainText={yearlyRepos.length}
            subText={githubTexts.reposCount}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            icon="cube"
            tipso={{
              text: githubTexts.popularestReposTip.replace(/\$/, maxStaredRepos['stargazers_count'])
            }}
            mainText={maxStaredRepos.name}
            subText={githubTexts.popularestRepos}
          />
          <InfoCard
            icon="clock-o"
            tipso={{
              text: maxTimeRepos.name
            }}
            mainText={`${getValidateDate(startTime)}~${getValidateDate(pushTime)}`}
            subText={githubTexts.longgestRepos}
          />
        </CardGroup>
      </CardGroup>
    );
  }

  renderReposReview() {
    const { userRepos, forkedRepos, commitDatas, loaded } = this.props;
    const chartContainer = cx(
      githubStyles["repos_chart_container"],
      githubStyles["with_chart"],
      githubStyles["small_margin"]
    );
    return (
      <div>
        {this.renderChartInfo()}
        {loaded ? (
          <div className={chartContainer}>
            <div className={githubStyles["repos_chart"]}>
              <canvas
                className={githubStyles["pie_chart"]}
                ref={ref => this.reposForks = ref}></canvas>
              <div className={githubStyles["chart_center"]}>
                {parseInt(userRepos.length * 100 / (userRepos.length + forkedRepos.length), 10)}%<br/>
                {githubTexts.originalRepos}
              </div>
            </div>
            <div className={githubStyles["repos_chart"]}>
              <canvas
                className={githubStyles["pie_chart"]}
                ref={ref => this.reposStars = ref}></canvas>
              <div className={githubStyles["chart_center"]}>
                {githubTexts.starPercentage}
              </div>
            </div>
          </div>
        ) : ''}
        {userRepos.length ? (
          <div className={chartStyles["canvas_container"]}>
            <canvas className={githubStyles["repos_review"]} ref={ref => this.reposReview = ref}></canvas>
          </div>
        ) : ''}
      </div>
    );
  }

  render() {
    const { userRepos, loaded, className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading={true} />)
    } else {
      component = (!userRepos || !userRepos.length) ?
        (<div className={cardStyles["empty_card"]}>{githubTexts.emptyText}</div>) : this.renderReposReview()
    }

    return (
      <div className={cx(cardStyles["info_card"], className)}>
        {component}
      </div>
    );
  }
}

RepositoryInfo.defaultProps = {
  className: '',
  forkedRepos: [],
  userRepos: [],
  loaded: false
};

export default RepositoryInfo;
