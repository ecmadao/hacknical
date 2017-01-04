import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import objectAssign from 'object-assign';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick.min';
import ScrollReveal from 'scrollreveal';

import Api from 'API/index';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import {
  MD_COLORS,
  randomColor,
  GREEN_COLORS
} from 'UTILS/colors';
import {
  sortRepos,
  getMaxIndex,
  getFirstTarget,
  sortLanguages
} from 'UTILS/helper';
import {
  getDateBySeconds,
  getDateAfterDays
} from 'UTILS/date';
import { DAYS, LINECHART_CONFIG } from 'UTILS/const_value';
import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';

const ReposInfo = (props) => {
  const { mainText, subText, style, icon } = props;
  return (
    <div className={style}>
      <div className="info_text info_sub_text">
        {subText}
      </div>
      <div className="info_text info_main_text">
        <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        {mainText}
      </div>
    </div>
  )
};

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      repos: [],
      commits: [],
      commitDatas: {
        dailyCommits: [],
        total: 0,
        commits: []
      },
      reposLanguages: [],
      languageDistributions: {},
      languageSkills: [],
      languageUsed: {}
    };
    this.reposChart = null;
    this.slickInitialed = false;
    this.languageSkillChart = null;
    this.commitsYearlyReviewChart = null;
  }

  componentDidMount() {
    const { login } = this.props;
    Api.github.getShareInfo(login).then((result) => {
      const { repos, commits } = result;
      this.setState({
        commits,
        loaded: true,
        repos: repos.sort(sortRepos()),
        commitDatas: github.combineReposCommits(commits),
        languageDistributions: github.getLanguageDistribution(repos),
        languageSkills: github.getLanguageSkill(repos),
        reposLanguages: [...github.getReposLanguages(repos)],
        languageUsed: github.getLanguageUsed(repos)
      });
    });
  }

  componentDidUpdate() {
    this.renderCharts();
    const { loaded } = this.state;
    loaded && this.initialSlick();
    loaded && this.initialScrollReveal();
  }

  initialScrollReveal() {
    const sr = ScrollReveal({ reset: true });
    sr.reveal('.share_info_chart', { duration: 150 });
    sr.reveal('.info_wrapper', { duration: 150 });
  }

  initialSlick() {
    if (this.slickInitialed) { return }
    $('.chart_info_container').slick({
      accessibility: false,
      arrows: false,
      slidesToShow: 2,
      mobileFirst: true,
      swipeToSlide: true,
      infinite: false,
      slidesToScroll: 1,
      variableWidth: true
    });
    this.slickInitialed = true;
  }

  renderCharts() {
    const { repos, commitDatas } = this.state;
    const { commits } = commitDatas;
    if (repos.length) {
      !this.reposChart && this.renderReposChart(repos.slice(0, 10));
      !this.languageSkillChart && this.renderLanguagesChart();
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
          label: '',
          pointHoverRadius: 2,
          pointHoverBorderWidth: 2,
          pointHitRadius: 2,
          pointBorderWidth: 0,
          pointRadius: 0,
        })]
      },
      options: {
        title: {
          display: false,
          text: ''
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display: false
            },
            ticks: {
              beginAtZero: true,
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

  renderLanguagesChart() {
    const { languageSkills } = this.state;
    const languages = Object.keys(languageSkills).filter(language => languageSkills[language] && language !== 'null');
    const skill = languages.map(language => languageSkills[language]);
    const languageSkill = ReactDOM.findDOMNode(this.languageSkill);
    this.languageSkillChart = new Chart(languageSkill, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [{
          data: skill,
          label: '',
          fill: true,
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 2,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        title: {
          display: true,
          text: ''
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `收到 star 数：${item.yLabel}`
            }
          }
        }
      }
    });
  }

  renderReposChart(repos) {
    const { commits } = this.state;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: github.getReposNames(repos),
        datasets: [
          chart.getStarDatasets(repos),
          chart.getForkDatasets(repos),
          chart.getCommitDatasets(repos, commits)
        ]
      },
      options: {
        title: {
          display: false,
          text: ''
        },
        // legend: {
        //   display: false,
        // },
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
            },
            ticks: {
              beginAtZero:true
            }
          }]
        },
      }
    });
  }

  renderCommitsInfo() {
    const { commitDatas, commits } = this.state;
    const { dailyCommits, total } = commitDatas;
    // commits
    const totalCommits = commits[0] ? commits[0].totalCommits : 0;
    // day info
    const maxIndex = getMaxIndex(dailyCommits);
    const dayName = DAYS[maxIndex];
    // first commit
    const [firstCommitWeek, firstCommitIndex] = getFirstTarget(commitDatas.commits, (item) => item.total);
    const week = getDateBySeconds(firstCommitWeek.week);
    const [firstCommitDay, dayIndex] = getFirstTarget(firstCommitWeek.days, (day) => day > 0);
    const firstCommitDate = getDateAfterDays(dayIndex, week);
    return (
      <div className="info_wrapper">
        <div className="share_info">
          <ChartInfo
            style="share_chart_info"
            mainText={parseInt(total / 52, 10)}
            subText="平均每周提交次数"
          />
          <ChartInfo
            style="share_chart_info"
            mainText={totalCommits}
            subText="单个仓库最多提交数"
          />
        </div>
        <div className="share_info">
          <ChartInfo
            mainText={dayName}
            style="share_chart_info"
            subText="是你提交最多的日子"
          />
          <ChartInfo
            style="share_chart_info"
            mainText={firstCommitDate}
            subText="2016年第一次提交"
          />
        </div>
      </div>
    )
  }

  renderReposInfo() {
    const { repos } = this.state;
    const [totalStar, totalFork] = github.getTotalCount(repos);

    const maxStaredRepos = repos[0] ? repos[0].name : '';
    const yearlyRepos = github.getYearlyRepos(repos);

    return (
      <div className="info_wrapper share_info_wrapper">
        <div className="chart_info_container">
          <div className="chart_info_wrapper">
            <ReposInfo
              icon="star-o"
              mainText={totalStar}
              subText="收获 star 数"
              style="chart_info_card"
            />
          </div>
          <div className="chart_info_wrapper">
            <ReposInfo
              icon="code-fork"
              mainText={totalFork}
              subText="收获 fork 数"
              style="chart_info_card"
            />
          </div>
          <div className="chart_info_wrapper">
            <ReposInfo
              icon="cubes"
              mainText={yearlyRepos.length}
              subText="创建的仓库数"
              style="chart_info_card"
            />
          </div>
          <div className="chart_info_wrapper">
            <ReposInfo
              icon="cube"
              mainText={maxStaredRepos}
              subText="最受欢迎的仓库"
              style="chart_info_card"
            />
          </div>
        </div>
      </div>
    )
  }

  renderLanguageLines() {
    const { languageUsed } = this.state;
    const color = randomColor();
    const languages = Object.keys(languageUsed).sort(sortLanguages(languageUsed));
    const maxUsedCounts = languageUsed[languages[0]];
    const languagesCount = languages.length;

    return languages.map((language, index) => {
      const style = {
        backgroundColor: color,
        opacity: `${(languagesCount - index) / languagesCount}`,
      };
      const barStyle = {
        width: `${(languageUsed[language] * 100 / maxUsedCounts).toFixed(2)}%`
      };
      return (
        <div className="repos_item" key={index}>
          <div
            style={barStyle}
            className="item_chart">
            <div
              style={style}
              className="commit_bar"></div>
          </div>
          <div className="item_data">
            {language}
          </div>
        </div>
      );
    });
  }

  renderReposDetailInfo() {
    const { repos, commits } = this.state;
    const color = randomColor();
    const targetRepos = repos.slice(0, 10);
    const targetCommits = commits.filter(commitObj => targetRepos.some(repos => repos.reposId === commitObj.reposId));

    const reposCount = targetRepos.length;
    const maxCommitsIndex = getMaxIndex(targetCommits, 'totalCommits');
    const maxCommits = targetCommits[maxCommitsIndex].totalCommits;
    const MAX_BAR_WIDTH = 0.75;

    return targetRepos.map((repository, index) => {
      const { reposId, stargazers_count, name } = repository;
      const filterCommits = targetCommits.filter(commitObj => commitObj.reposId === reposId);
      const totalCommits = filterCommits.length ? filterCommits[0].totalCommits : 0;
      const style = {
        backgroundColor: color,
        opacity: `${(reposCount - index) / reposCount}`,
      };
      const barStyle = {
        width: `${(totalCommits / maxCommits) * MAX_BAR_WIDTH * 100}%`
      };
      return (
        <div className="repos_item" key={index}>
          <div
            style={barStyle}
            className="item_chart">
            <div
              style={style}
              className="commit_bar"></div>
          </div>
          <div className="item_data">
            {totalCommits} commits
          </div>
        </div>
      )
    });
  }

  render() {
    const { loaded, languageSkills, languageDistributions } = this.state;

    if (!loaded) {
      return (
        <div className="loading_container">
          <Loading />
        </div>
      )
    }

    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);

    return (
      <div>
        <div className="share_section">
          <div className="share_info_chart repos_chart">
            <canvas
              className="max_canvas"
              ref={ref => this.reposReview = ref}></canvas>
          </div>
          {this.renderReposInfo()}
        </div>

        <div className="share_section">
          <div className="repos_wrapper">
            {/* <div className="repos_xAxes">
              <div className="xAxes_text">提交次数</div>
            </div> */}
            <div className="repos_contents_wrapper">
              <div className="repos_contents">
                {loaded ? this.renderLanguageLines() : ''}
                {/* {loaded ? this.renderReposDetailInfo() : ''} */}
              </div>
              <div className="repos_yAxes">
                <div className="yAxes_text">使用频次</div>
              </div>
            </div>
          </div>
        </div>

        <div className="share_section">
          <div className="info_wrapper">
            <div className="share_info">
              <ChartInfo
                style="share_chart_info"
                mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
                subText="拥有最多的仓库"
              />
              <ChartInfo
                style="share_chart_info"
                mainText={Object.keys(languageSkills)[maxStarCountIndex]}
                subText="拥有最多的 star"
              />
            </div>
          </div>
          <div className="share_info_chart">
            <canvas ref={ref => this.languageSkill = ref}></canvas>
          </div>
        </div>

        <div className="share_section">
          { loaded ? this.renderCommitsInfo() : ''}
          <div className="share_info_chart">
            <canvas
              className="max_canvas"
              ref={ref => this.commitsYearlyChart = ref}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default Share;
