import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import Loading from 'COMPONENTS/Loading';
// import Operations from 'COMPONENTS/Operations'
import githubActions from '../redux/actions';
import github from 'UTILS/github';
import { GREEN_COLORS } from 'UTILS/colors';
import {
  getMaxIndex
} from 'UTILS/helper';
import ChartInfo from 'COMPONENTS/ChartInfo';

class LanguageChart extends React.Component {
  constructor(props) {
    super(props);
    this.languageSkillChart = null;
    this.languageDistributionChart = null;
    this.chartClickCallback = this.chartClickCallback.bind(this);
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate() {
    this.renderCharts();
  }

  renderCharts() {
    const { repos } = this.props;
    if (repos.length) {
      !this.languageDistributionChart && this.renderPieChart();
      !this.languageSkillChart && this.renderRadarChart();
    }
  }

  chartClickCallback(ctx, data) {
    if (!data[0]) { return }
    const { actions } = this.props;
    const language = data[0]['_model'].label;
    actions.setShowLanguage(language);
  }

  renderPieChart() {
    const { languageDistributions } = this.props;
    const languages = Object.keys(languageDistributions).filter(language => language !== 'null');
    const distribution = languages.map(language => languageDistributions[language]);
    const languageDistribution = ReactDOM.findDOMNode(this.languageDistribution);
    this.languageDistributionChart = new Chart(languageDistribution, {
      type: 'doughnut',
      data: {
        labels: languages,
        datasets: [{
          data: distribution,
          backgroundColor: GREEN_COLORS
        }]
      },
      options: {
        onClick: this.chartClickCallback,
        title: {
          display: true,
          text: '各语言拥有的仓库数'
        }
      }
    });
  }

  renderRadarChart() {
    const { languageSkills } = this.props;
    const languages = Object.keys(languageSkills).filter(language => languageSkills[language] && language !== 'null');
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
          backgroundColor: GREEN_COLORS[4],
          borderWidth: 1,
          borderColor: GREEN_COLORS[0],
          pointBackgroundColor: GREEN_COLORS[0],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: GREEN_COLORS[0]
        }]
      },
      options: {
        onClick: this.chartClickCallback,
        title: {
          display: true,
          text: '擅长语言分析'
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

  renderEmptyCard() {
    return (
      <div></div>
    )
  }

  get operationItems() {
    const { actions } = this.props;
    return [
      {
        text: '更改仓库',
        icon: 'gears',
        onClick: () => actions.toggleModal(true)
      },
      {
        text: '不在简历中展示',
        onClick: () => {}
      }
    ]
  }

  renderShowRepos() {
    const { showLanguage, repos } = this.props;
    const targetRepos = github.getReposByLanguage(repos, showLanguage).map((repository, index) => {
      const stargazersCount = repository['stargazers_count'];
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
          <div className={`repos_star ${stargazersCount > 0 ? 'active' : ''}`}>
            <i className={`fa ${stargazersCount > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>&nbsp;{stargazersCount}
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

  renderChartInfo() {
    const { languageDistributions, languageSkills } = this.props;
    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);
    return (
      <div className="chart_info_container">
        <ChartInfo
          mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
          subText="拥有最多的仓库"
        />
        <ChartInfo
          mainText={Object.keys(languageSkills)[maxStarCountIndex]}
          subText="拥有最多的 star"
        />
      </div>
    )
  }

  render() {
    const { showLanguage } = this.props;
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-code"></i>&nbsp;&nbsp;编程语言</p>
        <div className="info_card card">
          {this.renderChartInfo()}
          <div className="repos_chart_container">
            <div className="repos_chart">
              <canvas id="repos_chart" ref={ref => this.languageDistribution = ref}></canvas>
            </div>
            <div className="repos_chart">
              <canvas ref={ref => this.languageSkill = ref}></canvas>
            </div>
          </div>
          { showLanguage ? this.renderShowRepos() : ''}
          {/* <Operations
            items={this.operationItems}
          /> */}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    repos,
    showedReposId,
    showLanguage
  } = state.github;

  return {
    repos,
    showedReposId,
    showLanguage,
    languageDistributions: github.getLanguageDistribution(repos),
    languageSkills: github.getLanguageSkill(repos)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageChart);
