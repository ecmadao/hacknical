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

const REPOS_BASE_URL = 'https://github.com';
const BLUE_COLORS = [
  'rgba(41, 128, 185, 1)',
  'rgba(41, 128, 185, 0.8)',
  'rgba(41, 128, 185, 0.6)',
  'rgba(41, 128, 185, 0.4)',
  'rgba(41, 128, 185, 0.2)'
]

const getForkDatasets = (repos) => {
  return {
    label: 'forks',
    data: getReposForks(repos),
    backgroundColor: 'rgba(74, 144, 226, 0.4)',
    borderColor: 'rgba(74, 144, 226, 0.7)',
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
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
    borderColor: 'rgba(74, 144, 226, 1)',
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
    const {actions} = this.props;
    actions.getGithubRepos();
  }

  componentDidUpdate(preProps) {
    const { repos } = this.props;
    const preRepos = preProps.repos;
    if (!preRepos.length && repos.length) {
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
          backgroundColor: "rgba(231, 76, 60, 0.2)",
          borderColor: "rgba(231, 76, 60, 1)",
          pointBackgroundColor: "rgba(231, 76, 60, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(231, 76, 60, 1)"
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
    const {username} = this.props;
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
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
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
          <div className="repos_star">
            <i className="fa fa-star-o" aria-hidden="true"></i>&nbsp;{repository['stargazers_count']}
          </div>
        </div>
      )
    });
    return (
      <div className="repos_show_container">
        {targetRepos}
      </div>
    )
  }

  render() {
    const { repos, showLanguage } = this.props;
    if (!repos || !repos.length) { return (<div></div>) }
    return (
      <div className="info_card_container repos_card_container">
        <p>仓库概览</p>
        <div className="info_card card">
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
