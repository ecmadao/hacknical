import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import cx from 'classnames';
import objectAssign from 'object-assign';

import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import { OPACITY } from 'UTILS/const_value';
import {
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

import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';
import githubStyles from '../styles/github.css';


class RepositoryInfo extends React.Component {
  constructor(props) {
    super(props);
    this.minDate = null;
    this.maxDate = null;
    this.reposReviewChart = null;
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate() {
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
    const { flatRepos } = this.props;

    const [totalStar, totalFork] = github.getTotalCount(flatRepos);

    const maxStaredRepos = flatRepos[0];

    const maxTimeRepos = github.longestContributeRepos(flatRepos);
    const startTime = maxTimeRepos['created_at'].split('T')[0];
    const pushTime = maxTimeRepos['pushed_at'].split('T')[0];

    const yearlyRepos = github.getYearlyRepos(flatRepos);

    return (
      <div>
        <div className={chartStyles["chart_info_container"]}>
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
        <div className={chartStyles["chart_info_container"]}>
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
      const { name, description, color, id, readme } = repository;
      const rgb = hex2Rgba(color);
      const isTarget = id === showedReposId;
      const opacity = isTarget ? OPACITY.min : OPACITY.max;
      const infoClass = isTarget ? cx(githubStyles["intro_info"], githubStyles["with_readme"]) : cx(githubStyles["intro_info"]);
      return (
        <div className={githubStyles["repos_intro"]} key={index}>
          <div
            className={githubStyles["intro_line"]}
            style={{background: `linear-gradient(to bottom, ${rgb(OPACITY.max)}, ${rgb(opacity)})`}}></div>
          <div className={githubStyles["intro_info_wrapper"]}>
            <div className={infoClass}>
              <span className={githubStyles["intro_title"]}>{name}</span><br/>
              <span>{description}</span>
            </div>
            {/* {isTarget && this.renderReposReadme(readme)} */}
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
      <div className={githubStyles["repos_timeline_container"]}>
        <div className={githubStyles["repos_dates"]}>
          <div className={githubStyles["repos_date"]}>{getRelativeTime(this.minDate)}</div>
          <div className={githubStyles["repos_date"]}>{getRelativeTime(this.maxDate)}</div>
        </div>
        <div className={githubStyles["repos_timelines"]}>
          {this.renderTimeLine(sortedRepos)}
        </div>
        <div className={githubStyles["repos_intros"]}>
          {this.renderReposIntros(sortedRepos)}
        </div>
      </div>
    )
  }

  renderTimeLine(repos) {
    const { showedReposId } = this.props;
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
        full_name
      } = repository;

      const left = offsetLeft(new Date(created_at));
      const right = offsetRight(new Date(pushed_at));
      const color = randomColor();
      repository.color = color;

      const isActive = showedReposId === reposId;
      const wrapperClass = cx(
        githubStyles["repos_timeline_wrapper"],
        isActive && githubStyles["active"]
      );
      const tipsoClass = cx(
        githubStyles["repos_tipso"],
        isActive && githubStyles["active"]
      );
      // const handleClick = isActive ? actions.closeReposReadme : () => actions.showReposReadme(full_name, reposId);
      return (
        <div
          key={index}
          className={wrapperClass}
          style={{marginLeft: left, marginRight: right}}>
          <div
            style={{backgroundColor: color}}
            className={githubStyles["repos_timeline"]}>
          </div>
          <div className={tipsoClass}>
            <div className={githubStyles["repos_tipso_container"]}>
              <span className={githubStyles["tipso_title"]}>{name}</span>&nbsp;&nbsp;{`<${language}>`}<br/>
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
        <div className={chartStyles["canvas_container"]}>
          <canvas className={githubStyles["repos_review"]} ref={ref => this.reposReview = ref}></canvas>
        </div>
        <div>
          {this.renderChosedRepos()}
        </div>
      </div>
    )
  }

  render() {
    const { flatRepos } = this.props;
    return (
      <div className={cx(cardStyles["info_card_container"], githubStyles["chart_card_container"])}>
        <p><i aria-hidden="true" className="fa fa-bar-chart"></i>&nbsp;&nbsp;仓库概览</p>
        <div className={cx(cardStyles["info_card"], cardStyles["card"])}>
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

export default connect(mapStateToProps)(RepositoryInfo);
