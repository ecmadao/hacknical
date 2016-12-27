import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import Loading from 'COMPONENTS/Loading';
import Operations from 'COMPONENTS/Operations'
import githubActions from '../redux/actions';
import {
  getFlatReposInfos,
  getLanguageDistribution,
  getLanguageSkill,
  getReposByLanguage
} from '../helper/repos';
import { BLUE_COLORS } from 'UTILS/colors';

class UserReposCard extends React.Component {
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
    const { flatRepos } = this.props;
    if (flatRepos.length) {
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
    const { showLanguage, flatRepos } = this.props;
    const targetRepos = getReposByLanguage(flatRepos, showLanguage).map((repository, index) => {
      return (
        <div className="repos_show" key={index}>
          <div className="repos_info">
            <a
              target="_blank"
              href={repository.htmlUrl}
              className="repos_info_name">
              {repository.name}
            </a>{repository.fork ? (<span className="repos_info_forked">
              <i className="fa fa-code-fork" aria-hidden="true">
              </i>&nbsp;
              forked
            </span>) : ''}<br/>
            <span>{repository.description}</span>
          </div>
          <div className={`repos_star ${repository.stargazersCount > 0 ? 'active' : ''}`}>
            <i className={`fa ${repository.stargazersCount > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>&nbsp;{repository.stargazersCount}
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
    const { showLanguage } = this.props;
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-code"></i>&nbsp;&nbsp;编程语言</p>
        <div className="info_card card">
          <div className="repos_chart_container">
            <div className="repos_chart">
              <canvas id="repos_chart" ref={ref => this.languageDistribution = ref}></canvas>
            </div>
            <div className="repos_chart">
              <canvas ref={ref => this.languageSkill = ref}></canvas>
            </div>
          </div>
          { showLanguage ? this.renderShowRepos() : ''}
          <Operations
            items={this.operationItems}
          />
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
    showedReposId,
    showLanguage,
    flatRepos: getFlatReposInfos(repos),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserReposCard);
