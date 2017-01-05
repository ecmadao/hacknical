import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import ChartInfo from 'COMPONENTS/ChartInfo';
import Loading from 'COMPONENTS/Loading';
import Label from 'COMPONENTS/Label';
// import Operations from 'COMPONENTS/Operations'
import github from 'UTILS/github';
import { GREEN_COLORS, randomColor } from 'UTILS/colors';
import {
  getMaxIndex,
  sortLanguages
} from 'UTILS/helper';


class LanguageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLanguage: null
    };
    this.labelColor = randomColor();
    this.languageSkillChart = null;
    this.languageUsedChart = null;
    this.setShowLanguage = this.setShowLanguage.bind(this);
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate() {
    this.renderCharts();
  }

  renderCharts() {
    const { loaded } = this.props;
    if (loaded) {
      !this.languageUsedChart && this.renderLanguageUsedChart();
      !this.languageSkillChart && this.renderLanguageSkillsChart();
    }
  }

  renderLanguageUsedChart() {
    const { languageUsed } = this.props;
    const languages = Object.keys(languageUsed);
    let total = 0;
    languages.forEach(key => total += languageUsed[key]);
    const languagePercentage = languages.map(language => languageUsed[language] / total);

    const languageUsedDOM = ReactDOM.findDOMNode(this.languageUsed);
    this.languageUsedChart = new Chart(languageUsedDOM, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [{
          data: languagePercentage,
          label: '',
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
        title: {
          display: true,
          text: '语言使用频次'
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `占比：${(item.yLabel * 100).toFixed(2)}%`
            }
          }
        }
      }
    });
  }

  renderLanguageSkillsChart() {
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
          label: '',
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
        title: {
          display: true,
          text: '语言 & 获得 star'
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `与该语言相关 star 数：${item.yLabel}`
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

  // get operationItems() {
  //   const { actions } = this.props;
  //   return [
  //     {
  //       text: '更改仓库',
  //       icon: 'gears',
  //       onClick: () => actions.toggleModal(true)
  //     },
  //     {
  //       text: '不在简历中展示',
  //       onClick: () => {}
  //     }
  //   ]
  // }

  renderShowRepos() {
    const { repos } = this.props;
    const { showLanguage } = this.state;
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
    const { languageDistributions, languageSkills, languageUsed } = this.props;
    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);
    const maxUsedLanguage = Object.keys(languageUsed).sort(sortLanguages(languageUsed))[0];
    return (
      <div className="chart_info_container">
        <ChartInfo
          mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
          subText="拥有最多的仓库"
        />
        <ChartInfo
          mainText={maxUsedLanguage}
          subText="最常使用的语言"
        />
        <ChartInfo
          mainText={Object.keys(languageSkills)[maxStarCountIndex]}
          subText="拥有最多的 star"
        />
      </div>
    )
  }

  setShowLanguage(language) {
    const { showLanguage } = this.state;
    const value = showLanguage === language ? null : language;
    this.setState({ showLanguage: value });
  }

  renderLanguagesLabel() {
    const { languageUsed } = this.props;
    const { showLanguage } = this.state;
    const languages = Object.keys(languageUsed).sort(sortLanguages(languageUsed)).map((language, index) => {
      return (
        <Label
          key={index}
          style={{
            backgroundColor: this.labelColor
          }}
          text={language}
          id={language}
          onClick={this.setShowLanguage}
          active={language === showLanguage}
        />
      )
    });
    return (
      <div className="language_label_wrapper">
        {languages}
      </div>
    )
  }

  renderLanguageReview() {
    const { showLanguage } = this.state;
    return (
      <div>
        {this.renderChartInfo()}
        <div className="repos_chart_container">
          <div className="repos_chart">
            <canvas ref={ref => this.languageUsed = ref}></canvas>
          </div>
          <div className="repos_chart">
            <canvas ref={ref => this.languageSkill = ref}></canvas>
          </div>
        </div>
        {this.renderLanguagesLabel()}
        { showLanguage ? this.renderShowRepos() : ''}
        {/* <Operations
          items={this.operationItems}
        /> */}
      </div>
    )
  }

  render() {
    const { loaded } = this.props;
    return (
      <div className="info_card_container chart_card_container">
        <p><i aria-hidden="true" className="fa fa-code"></i>&nbsp;&nbsp;编程语言</p>
        <div className="info_card card">
          { !loaded ? (
            <Loading />
          ) : this.renderLanguageReview()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {
    repos,
    showedReposId
  } = state.github;

  return {
    repos,
    loaded: repos.length > 0,
    showedReposId,
    languageDistributions: github.getLanguageDistribution(repos),
    languageUsed: github.getLanguageUsed(repos),
    languageSkills: github.getLanguageSkill(repos)
  }
}

export default connect(mapStateToProps)(LanguageInfo);
