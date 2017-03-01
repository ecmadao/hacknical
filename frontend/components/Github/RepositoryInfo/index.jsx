import React from 'react';
import ReactDOM from 'react-dom';
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
import dateHelper from 'UTILS/date';
import {
  sortRepos,
  getOffsetLeft,
  getOffsetRight
} from 'UTILS/helper';
import locales from 'LOCALES';

import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';
import githubStyles from '../styles/github.css';

const githubTexts = locales('github').sections.repos;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getRelativeTime = dateHelper.relative.hoursBefore;
const getValidateDate = dateHelper.validator.fullDate;

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
    if (flatRepos.length) {
      !this.reposReviewChart && this.renderBarChart(flatRepos.slice(0, 10));
    }
  }

  renderBarChart(flatRepos) {
    const { commitDatas } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    const datasets = [
      chart.getStarDatasets(flatRepos),
      chart.getForkDatasets(flatRepos)
    ];
    if (commitDatas.length) {
      datasets.push(
        chart.getCommitDatasets(flatRepos, commitDatas)
      )
    }
    this.reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        datasets,
        labels: github.getReposNames(flatRepos)
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
            subText={githubTexts.starsCount}
          />
          <ChartInfo
            icon="code-fork"
            mainText={totalFork}
            subText={githubTexts.forksCount}
          />
          <ChartInfo
            icon="cubes"
            mainText={yearlyRepos.length}
            subText={githubTexts.reposCount}
          />
        </div>
        <div className={chartStyles["chart_info_container"]}>
          <ChartInfo
            icon="cube"
            mainText={maxStaredRepos.name}
            subText={githubTexts.popularestRepos}
          />
          <ChartInfo
            icon="clock-o"
            mainText={`${getValidateDate(startTime)}~${getValidateDate(pushTime)}`}
            subText={githubTexts.longgestRepos}
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
      const { name, description, color, id, readme, html_url } = repository;
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
              <a className={githubStyles["intro_title"]} href={html_url} target="_blank">
                {name}
              </a><br/>
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
    this.minDate = dateHelper.validator.full(sortedRepos[0]['created_at']);
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
    const minDate = getSecondsByDate(this.minDate);
    const maxDate = getSecondsByDate(this.maxDate);

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
        fork
      } = repository;

      const left = offsetLeft(getSecondsByDate(created_at));
      const right = offsetRight(getSecondsByDate(pushed_at));
      const color = randomColor();
      repository.color = color;

      const isActive = showedReposId === reposId;
      const wrapperClass = cx(
        githubStyles["repos_timeline_wrapper"],
        isActive && githubStyles["active"]
      );
      const tipsoClass = cx(
        githubStyles["tipso_wrapper"],
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
            <div className={githubStyles["tipso_container"]}>
              <span className={githubStyles["tipso_title"]}>
                {name}
                &nbsp;&nbsp;
                {`<${language}>`}
                &nbsp;&nbsp;
                {fork ? '<fork>' : ''}
              </span><br/>
              <span>
                <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
                &nbsp;&nbsp;&nbsp;
                <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}
              </span><br/>
              <span>{getValidateDate(created_at)} ~ {getValidateDate(pushed_at)}</span>
            </div>
          </div>
        </div>
      )
    });
  }

  renderReposReview() {
    const { flatRepos, commitDatas } = this.props;
    return (
      <div>
        {this.renderChartInfo()}
        {flatRepos.length ? (
          <div className={chartStyles["canvas_container"]}>
            <canvas className={githubStyles["repos_review"]} ref={ref => this.reposReview = ref}></canvas>
          </div>
        ) : ''}
        <div>
          {this.renderChosedRepos()}
        </div>
      </div>
    )
  }

  render() {
    const { flatRepos, loaded } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading />)
    } else {
      component = (!flatRepos || !flatRepos.length) ?
        (<div className={cardStyles["empty_card"]}>没有仓库信息</div>) : this.renderReposReview()
    }

    return (
      <div className={cardStyles["info_card"]}>
        {component}
      </div>
    )
  }
}

export default RepositoryInfo;
