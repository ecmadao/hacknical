import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';
import cx from 'classnames';

import githubActions from '../redux/actions';
import github from 'UTILS/github';
import { BLUE_COLORS, hex2Rgba } from 'UTILS/colors';
import {
  getRelativeTime,
  getSecondsByDate,
  getSecondsBeforeYears
} from 'UTILS/date';
import {
  sortRepos
} from 'UTILS/helper';
import ChartInfo from './ChartInfo';

const getOffsetLeft = (start, end) => (left) => {
  const length = end - start;
  return `${(left - start) * 100 / length}%`;
};

const getOffsetRight = (start, end) => (right) => {
  const length = end - start;
  return `${(end - right) * 100 / length}%`;
};

const REPOS_BASE_URL = 'https://github.com';
const RANDOM_COLORS = [
  '#4A90E2',
  '#50E3C2',
  '#9B9B9B',
  '#00BCD4',
  '#F44336',
  '#FDD835',
  '#FF9800',
  '#78909C',
  '#673AB7',
  '#E91E63'
];
const MAX_OPACITY = 1;
const MIN_OPACITY = 0.3;

const randomColor = () => {
  const index = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[index];
};

const getTotalCount = (repos) => {
  let totalStar = 0;
  let totalFork = 0;
  repos.forEach((repository) => {
    totalStar += repository['stargazers_count'];
    totalFork += repository['forks_count'];
  });
  return [totalStar, totalFork]
};

const getForkDatasets = (repos) => {
  return {
    label: 'forks',
    data: github.getReposForks(repos),
    backgroundColor: BLUE_COLORS[2],
    borderColor: BLUE_COLORS[1],
    borderWidth: 1
  }
};

const chartClickCallback = (username) => {
  return (ctx, data) => {
    if (!data[0]) {
      return;
    }
    window.location.target = "_blank";
    const reposName = data[0]['_model'].label;
    window.open(`${REPOS_BASE_URL}/${username}/${reposName}`);
  }
};

const getStarDatasets = (repos) => {
  return {
    label: 'stars',
    data: github.getReposStars(repos),
    backgroundColor: BLUE_COLORS[1],
    borderColor: BLUE_COLORS[0],
    borderWidth: 1
  }
};

const getMaxObject = (array, callback) => {
  let max = {};
  array.forEach((item, index) => {
    if (index === 0 || (index !== 0 && callback(item, max))) {
      max = item;
      max['persistTime'] = getSecondsByDate(item['pushed_at']) - getSecondsByDate(item['created_at']);
    }
  });
  return max;
};

class ReposChart extends React.Component {
  constructor(props) {
    super(props);
    this.minDate = null;
    this.maxDate = null;
    this.reposReviewChart = null;
  }

  componentDidMount() {
    const { actions, flatRepos } = this.props;
    this.renderCharts();
    if (!flatRepos.length) {
      actions.getGithubRepos();
    }
    actions.choseRepos();
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
  }

  renderCharts() {
    const { flatRepos } = this.props;
    if (flatRepos.length) {
      !this.reposReviewChart && this.renderBarChart(flatRepos.slice(0, 10));
    }
  }

  renderBarChart(flatRepos) {
    const { username } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: github.getReposNames(flatRepos),
        datasets: [getStarDatasets(flatRepos), getForkDatasets(flatRepos)]
      },
      options: {
        onClick: chartClickCallback(username),
        title: {
          display: true,
          text: '仓库 star/fork 数一览（取前十）'
        },
        scales: {
          xAxes: [{
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
          }]
        },
      }
    });
  }

  renderChartInfo() {
    const { flatRepos } = this.props;
    const [totalStar, totalFork] = getTotalCount(flatRepos);
    const maxStaredRepos = flatRepos[0];

    const maxTimeRepos = getMaxObject(flatRepos, (currentRepos, maxRepos) => {
      const currentPresist = getSecondsByDate(currentRepos['pushed_at']) - getSecondsByDate(currentRepos['created_at']);
      return currentPresist > maxRepos.persistTime;
    });
    const startTime = maxTimeRepos['created_at'].split('T')[0];
    const pushTime = maxTimeRepos['pushed_at'].split('T')[0];

    const yearAgoSeconds = getSecondsBeforeYears(1);
    const yearlyRepos = flatRepos.filter((repository) => {
      return !repository.fork && getSecondsByDate(repository['created_at']) > yearAgoSeconds
    });

    return (
      <div>
        <div className="chart_info_container">
          <ChartInfo
            mainText={totalStar}
            subText="收获 star 数"
          />
          <ChartInfo
            mainText={totalFork}
            subText="收获 fork 数"
          />
          <ChartInfo
            mainText={yearlyRepos.length}
            subText="创建的仓库数"
          />
        </div>
        <div className="chart_info_container">
          <ChartInfo
            mainText={maxStaredRepos.name}
            subText="最受欢迎的仓库"
          />
          <ChartInfo
            mainText={`${startTime.split('-').join('/')}~${pushTime.split('-').join('/')}`}
            subText="贡献时间最久的仓库"
          />
        </div>
      </div>
    )
  }

  renderReposReadme(readme) {
    if (readme) {
      return (<div className="readme_container wysiwyg" dangerouslySetInnerHTML={{__html: readme}} />);
    }
    return (
      <div className="readme_container">
        <Loading />
      </div>
    )
  }

  renderReposIntros(repos) {
    const { showedReposId } = this.props;
    return repos.map((repository, index) => {
      const {name, description, color, id, readme} = repository;
      const rgb = hex2Rgba(color);
      const isTarget = id === showedReposId;
      const opacity = isTarget ? MIN_OPACITY : MAX_OPACITY;
      const infoClass = isTarget ? 'intro_info with_readme' : 'intro_info';
      return (
        <div className="repos_intro" key={index}>
          <div
            className="intro_line"
            style={{background: `linear-gradient(to bottom, ${rgb(MAX_OPACITY)}, ${rgb(opacity)})`}}></div>
          <div className="intro_info_wrapper">
            <div className={infoClass}>
              <span className="intro_title">{name}</span><br/>
              <span className="intro_desc">{description}</span>
            </div>
            {isTarget && this.renderReposReadme(readme)}
          </div>
        </div>
      );
    });
  }

  renderChosedRepos() {
    const { chosedRepos } = this.props;
    const sortedRepos = github.sortByDate(chosedRepos);
    this.minDate = sortedRepos[0]['created_at'].split('T')[0];
    this.maxDate = github.getMaxDate(sortedRepos);
    return (
      <div className="repos_timeline_container">
        <div className="repos_dates">
          <div className="repos_date">{getRelativeTime(this.minDate)}</div>
          <div className="repos_date">{getRelativeTime(this.maxDate)}</div>
        </div>
        <div className="repos_timelines">
          {this.renderTimeLine(sortedRepos)}
        </div>
        <div className="repos_intros">
          {this.renderReposIntros(sortedRepos)}
        </div>
      </div>
    )
  }

  renderTimeLine(repos) {
    const {actions, showedReposId} = this.props;
    const minDate = new Date(this.minDate);
    const maxDate = new Date(this.maxDate);
    const offsetLeft = getOffsetLeft(minDate, maxDate);
    const offsetRight = getOffsetRight(minDate, maxDate);
    return repos.map((repository, index) => {
      const {
        created_at,
        pushed_at,
        name,
        language,
        forks_count,
        stargazers_count,
        reposId,
        full_name,
        color
      } = repository;

      const left = offsetLeft(new Date(created_at));
      const right = offsetRight(new Date(pushed_at));
      repository.color = color || randomColor();
      const isActive = showedReposId === reposId;
      const wrapperClass = cx('repos_timeline_wrapper', {
        'active': isActive
      });
      const handleClick = isActive ? actions.closeReposReadme : () => actions.showReposReadme(full_name, reposId);
      return (
        <div
          key={index}
          className={wrapperClass}
          style={{marginLeft: left, marginRight: right}}>
          <div
            style={{backgroundColor: repository.color}}
            className="repos_timeline"
            onClick={handleClick}>
          </div>
          <div className="repos_tipso">
            <div className="repos_tipso_container">
              <span className="tipso_title">{name}</span>&nbsp;&nbsp;{`<${language}>`}<br/>
              <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
              &nbsp;&nbsp;&nbsp;
              <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}<br/>
              <p>{created_at.split('T')[0]} ~ {pushed_at.split('T')[0]}</p>
            </div>
          </div>
        </div>
      )
    });
  }

  render() {
    const { flatRepos, chosedRepos } = this.props;
    if (!flatRepos || !flatRepos.length) { return (<div></div>) }
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-bar-chart"></i>&nbsp;&nbsp;仓库概览</p>
        <div className="info_card card">
          {this.renderChartInfo()}
          <div className="canvas_container">
            <canvas id="repos_review" ref={ref => this.reposReview = ref}></canvas>
          </div>
          <div className="repos_timelines_wrapper">
            {chosedRepos.length ? this.renderChosedRepos() : ''}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    repos,
    user,
    chosedRepos,
    commitDatas,
    showedReposId
  } = state.github;
  const reposCommitsByIds = github.getReposByIds(commitDatas, chosedRepos);
  const reposInfo = github.getReposInfo(reposCommitsByIds, repos);

  return {
    showedReposId,
    chosedRepos: reposInfo,
    flatRepos: repos.sort(sortRepos()),
    username: user && user.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReposChart);
