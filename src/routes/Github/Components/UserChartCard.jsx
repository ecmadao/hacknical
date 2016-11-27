import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import {
  getFlatReposInfos,
  getReposNames,
  getReposForks,
  getReposStars,
  getLanguageDistribution,
  getLanguageSkill
} from '../helper/repos';

const REPOS_BASE_URL = 'https://github.com';

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
  componentDidMount() {
    const {repos} = this.props;
    const flatRepos = getFlatReposInfos(repos);
    this.renderBarChart(flatRepos.slice(0, 10));
    this.renderPieChart(flatRepos);
    this.renderRadarChart(flatRepos);
  }

  renderPieChart(flatRepos) {
    const languageDistributions = getLanguageDistribution(flatRepos);
    const languages = Object.keys(languageDistributions);
    const distribution = languages.map(language => languageDistributions[language]);
    const languageDistribution = ReactDOM.findDOMNode(this.languageDistribution);
    const languageDistributionChart = new Chart(languageDistribution, {
      type: 'pie',
      data: {
        labels: languages,
        datasets: [{
          data: distribution,
          backgroundColor: 'rgba(74, 144, 226, 0.7)'
        }]
      },
      options: {
        title: {
          display: true,
          text: '仓库语言分布'
        }
      }
    });
  }

  renderRadarChart(flatRepos) {
    const languageSkills = getLanguageSkill(flatRepos);
    console.log(languageSkills);
    const languages = Object.keys(languageSkills).filter(language => languageSkills[language]);
    const skill = languages.map(language => languageSkills[language]);
    const languageSkill = ReactDOM.findDOMNode(this.languageSkill);
    const languageSkillChart = new Chart(languageSkill, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [{
          data: skill,
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
    const reposReviewChart = new Chart(reposReview, {
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

  render() {
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
        </div>
      </div>
    )
  }
}

export default UserChartCard;
