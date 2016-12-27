import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';

import {
  getFlatReposInfos,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill,
  getReposByLanguage
} from '../helper/repos';
import githubActions from '../redux/actions';
import { BLUE_COLORS } from 'UTILS/colors';
const REPOS_BASE_URL = 'https://github.com';

const getForkDatasets = (repos) => {
  return {
    label: 'forks',
    data: getReposForks(repos),
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
    data: getReposStars(repos),
    backgroundColor: BLUE_COLORS[1],
    borderColor: BLUE_COLORS[0],
    borderWidth: 1
  }
};

class UserChartCard extends React.Component {
  constructor(props) {
    super(props);
    this.reposReviewChart = null;
    this.languageSkillChart = null;
    this.languageDistributionChart = null;
    this.chartClickCallback = this.chartClickCallback.bind(this);
  }

  componentDidMount() {
    const { actions, repos } = this.props;
    this.renderCharts();
    if (!repos.length) {
      actions.getGithubRepos();
    }
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
  }

  renderCharts() {
    const { repos } = this.props;
    if (repos.length) {
      const flatRepos = getFlatReposInfos(repos);
      !this.reposReviewChart && this.renderBarChart(flatRepos.slice(0, 10));
      !this.languageDistributionChart && this.renderPieChart(flatRepos);
      !this.languageSkillChart && this.renderRadarChart(flatRepos);
    }
  }

  chartClickCallback(ctx, data) {
    if (!data[0]) { return }
    const { actions } = this.props;
    const language = data[0]['_model'].label;
    actions.setShowLanguage(language);
  }

  renderPieChart(flatRepos) {
    const languageDistributions = getLanguageDistribution(flatRepos);
    const languages = Object.keys(languageDistributions);
    const distribution = languages.map(language => languageDistributions[language]);
    const languageDistribution = ReactDOM.findDOMNode(this.languageDistribution);
    this.languageDistributionChart = new Chart(languageDistribution, {
      type: 'doughnut',
      data: {
        labels: languages,
        datasets: [{
          data: distribution,
          backgroundColor: BLUE_COLORS
        }]
      },
      options: {
        onClick: this.chartClickCallback,
        title: {
          display: true,
          text: '仓库语言分布'
        }
      }
    });
  }

  renderRadarChart(flatRepos) {
    const languageSkills = getLanguageSkill(flatRepos);
    const languages = Object.keys(languageSkills).filter(language => languageSkills[language]);
    const skill = languages.map(language => languageSkills[language]);
    const languageSkill = ReactDOM.findDOMNode(this.languageSkill);
    this.languageSkillChart = new Chart(languageSkill, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [{
          data: skill,
          label: '擅长语言',
          fill: true,
          backgroundColor: BLUE_COLORS[3],
          borderColor: BLUE_COLORS[0],
          pointBackgroundColor: BLUE_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: BLUE_COLORS[0]
        }]
      },
      options: {
        onClick: this.chartClickCallback,
        title: {
          display: true,
          text: '擅长语言分析'
        }
      }
    });
  }

  renderBarChart(flatRepos) {
    const { username } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: getReposNames(flatRepos),
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
            // gridLines: {
            //   display:false
            // },
            ticks: {
              beginAtZero:true
            }
          }]
        },
      }
    });
  }

  renderShowRepos() {
    const { showLanguage, repos } = this.props;
    const targetRepos = getReposByLanguage(repos, showLanguage).map((repository, index) => {
      return (
        <div className="repos_show" key={index}>
          <div className="repos_info">
            <a
              target="_blank"
              href={repository['html_url']}
              className="repos_info_name">
              {repository.name}
            </a>{repository.fork ? (<span className="repos_info_forked">
              <i className="fa fa-code-fork" aria-hidden="true">
              </i>&nbsp;
              forked
            </span>) : ''}<br/>
            <span>{repository.description}</span>
          </div>
          <div className={`repos_star ${repository['stargazers_count'] > 0 ? 'active' : ''}`}>
            <i className={`fa ${repository['stargazers_count'] > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>&nbsp;{repository['stargazers_count']}
          </div>
        </div>
      )
    });
    return (
      <div className="repos_show_container">
        <p className="repos_show_title">{showLanguage}</p>
        {targetRepos}
      </div>
    )
  }

  render() {
    const { repos, showLanguage } = this.props;
    if (!repos || !repos.length) { return (<div></div>) }
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-bar-chart"></i>&nbsp;&nbsp;仓库概览</p>
        <div className="info_card card chart_card">
          <canvas id="repos_review" ref={ref => this.reposReview = ref}></canvas>
          <div className="repos_chart_container">
            <div className="repos_chart">
              <canvas id="repos_chart" ref={ref => this.languageDistribution = ref}></canvas>
            </div>
            <div className="repos_chart">
              <canvas ref={ref => this.languageSkill = ref}></canvas>
            </div>
          </div>
          { showLanguage ? this.renderShowRepos() : ''}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { showLanguage, repos, user } = state.github;
  return {
    repos,
    showLanguage,
    username: user && user.name
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserChartCard);
