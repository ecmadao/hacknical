import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';

import githubActions from '../redux/actions';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import { LINECHART_CONFIG, OPACITY } from 'UTILS/const_value';
import {
  GREEN_COLORS,
  randomColor,
  hex2Rgba
} from 'UTILS/colors';
import {
  getRelativeTime
} from 'UTILS/date';
import {
  sortRepos,
  getOffsetLeft,
  getOffsetRight
} from 'UTILS/helper';

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
    const { flatRepos, commitDatas } = this.props;
    if (flatRepos.length && commitDatas.length) {
      !this.reposReviewChart && this.renderBarChart(flatRepos.slice(0, 10));
    }
  }

  renderBarChart(flatRepos) {
    const { commitDatas } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: github.getReposNames(flatRepos),
        datasets: [
          chart.getStarDatasets(flatRepos),
          chart.getForkDatasets(flatRepos),
          chart.getCommitDatasets(flatRepos, commitDatas)
        ]
      },
      options: {
        title: {
          display: true,
          text: '仓库 star/fork/commit 数一览（取前十）'
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

    const [totalStar, totalFork] = github.getTotalCount(flatRepos);

    const maxStaredRepos = flatRepos[0];

    const maxTimeRepos = github.longestContributeRepos(flatRepos);
    const startTime = maxTimeRepos['created_at'].split('T')[0];
    const pushTime = maxTimeRepos['pushed_at'].split('T')[0];

    const yearlyRepos = github.getYearlyRepos(flatRepos);

    return (
      <div>
        <div className="chart_info_container">
          <ChartInfo
            icon="star-o"
            mainText={totalStar}
            subText="收获 star 数"
          />
          <ChartInfo
            icon="code-fork"
            mainText={totalFork}
            subText="收获 fork 数"
          />
          <ChartInfo
            icon="cubes"
            mainText={yearlyRepos.length}
            subText="创建的仓库数"
          />
        </div>
        <div className="chart_info_container">
          <ChartInfo
            icon="cube"
            mainText={maxStaredRepos.name}
            subText="最受欢迎的仓库"
          />
          <ChartInfo
            icon="clock-o"
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
      const opacity = isTarget ? OPACITY.min : OPACITY.max;
      const infoClass = isTarget ? 'intro_info with_readme' : 'intro_info';
      return (
        <div className="repos_intro" key={index}>
          <div
            className="intro_line"
            style={{background: `linear-gradient(to bottom, ${rgb(OPACITY.max)}, ${rgb(opacity)})`}}></div>
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
    const { flatRepos } = this.props;
    const sortedRepos = github.sortByDate(flatRepos.slice(0, 10));
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
    const { actions, showedReposId } = this.props;
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
      const tipsoClass = cx('repos_tipso', {
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
          <div className={tipsoClass}>
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

  renderReposReview() {
    return (
      <div>
        {this.renderChartInfo()}
        <div className="canvas_container">
          <canvas id="repos_review" ref={ref => this.reposReview = ref}></canvas>
        </div>
        <div className="repos_timelines_wrapper">
          {this.renderChosedRepos()}
        </div>
      </div>
    )
  }

  render() {
    const { flatRepos } = this.props;
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-bar-chart"></i>&nbsp;&nbsp;仓库概览</p>
        <div className="info_card card">
          {!flatRepos || !flatRepos.length ? (
            <Loading />
          ) : this.renderReposReview()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    repos,
    user,
    showedReposId,
    commitDatas
  } = state.github;

  return {
    showedReposId,
    commitDatas,
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
