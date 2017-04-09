import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import {
  Loading,
  InfoCard,
  CardGroup,
  Label
} from 'light-ui';

import github from 'UTILS/github';
import { GREEN_COLORS, randomColor } from 'UTILS/colors';
import {
  sortByX,
  getMaxIndex,
  sortLanguages
} from 'UTILS/helper';
import locales from 'LOCALES';
import chart from 'UTILS/chart';

import githubStyles from '../styles/github.css';
import chartStyles from '../styles/chart.css';
import cardStyles from '../styles/info_card.css';

const sortByLanguageStar = sortByX('star');
const githubTexts = locales('github').sections.languages;

class LanguageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLanguage: null
    };
    this.languages = [];
    this.labelColor = randomColor();
    this.languageSkillChart = null;
    this.languageUsedChart = null;
    this.setShowLanguage = this.setShowLanguage.bind(this);
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate(preProps) {
    const { languageUsed } = this.props;
    // if (!Object.keys(preProps.languageUsed).length && Object.keys(languageUsed).length) {
    //   this.setState({
    //     showLanguage: this.sortedLanguages[0]
    //   });
    // }
    this.renderCharts();
  }

  renderCharts() {
    const { loaded } = this.props;
    if (loaded) {
      !this.languageUsedChart && ReactDOM.findDOMNode(this.languageUsed) && this.renderLanguageUsedChart();
      !this.languageSkillChart && ReactDOM.findDOMNode(this.languageSkill) && this.renderLanguageSkillsChart();
    }
  }

  renderLanguageUsedChart() {
    const { languageUsed } = this.props;
    const languages = this.sortedLanguages;
    let total = 0;
    languages.forEach(key => total += languageUsed[key]);
    const languagePercentage = languages.map(language => languageUsed[language] / total);

    const languageUsedDOM = ReactDOM.findDOMNode(this.languageUsed);
    this.languageUsedChart = new Chart(languageUsedDOM, {
      type: 'radar',
      data: {
        labels: languages,
        datasets: [chart.radar(languagePercentage)]
      },
      options: {
        title: {
          display: true,
          text: githubTexts.usageChart.title
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return `${githubTexts.usageChart.label}${(item.yLabel * 100).toFixed(2)}%`
            }
          }
        }
      }
    });
  }

  renderLanguageSkillsChart() {
    const { languageSkills } = this.props;
    const languages = [], skills = [];
    const languageArray = Object.keys(languageSkills).filter(language => languageSkills[language] && language !== 'null').slice(0, 6).map(language => ({ star: languageSkills[language], language })).sort(sortByLanguageStar);
    languageArray.forEach((obj) => {
      languages.push(obj.language);
      skills.push(obj.star);
    });

    const languageSkill = ReactDOM.findDOMNode(this.languageSkill);
    this.languageSkillChart = new Chart(languageSkill, {
      type: 'polarArea',
      data: {
        labels: languages,
        datasets: [chart.polarArea(skills)]
      },
      options: {
        title: {
          display: true,
          text: githubTexts.starChart.title
        },
        legend: {
          display: false,
        },
        // tooltips: {
        //   callbacks: {
        //     label: (item, data) => {
        //       return `${githubTexts.starChart.label}${item.yLabel}`
        //     }
        //   }
        // }
      }
    });
  }

  renderShowRepos() {
    const { repos } = this.props;
    const { showLanguage } = this.state;
    const targetRepos = github.getReposByLanguage(repos, showLanguage).map((repository, index) => {
      const stargazersCount = repository['stargazers_count'];
      const starClass = cx(
        githubStyles["repos_star"],
        stargazersCount > 0 && githubStyles["active"]
      );
      return (
        <div className={githubStyles["repos_show"]} key={index}>
          <div className={githubStyles["repos_info"]}>
            <a
              target="_blank"
              href={repository['html_url']}
              className={githubStyles["repos_info_name"]}>
              {repository.name}
            </a>
            {repository.fork ? (
              <Label
                icon="code-fork"
                text="forked"
                color="gray"
                clickable={false}
              />
            ) : ''}<br/>
            <span className={githubStyles["repos_short_desc"]}>
              {repository.description}
            </span>
          </div>
          <div className={starClass}>
            <i className={`fa ${stargazersCount > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>&nbsp;{stargazersCount}
          </div>
        </div>
      )
    });
    return (
      <div className={githubStyles["repos_show_container"]}>
        <p className={githubStyles["repos_show_title"]}>
          {showLanguage}&nbsp;
          <span>{githubTexts.relativeRepos}</span>
        </p>
        {targetRepos}
      </div>
    );
  }

  renderChartInfo() {
    const { languageDistributions, languageSkills, languageUsed } = this.props;

    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key]);
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key]);
    const maxReposCountIndex = getMaxIndex(reposCount);
    const maxStarCountIndex = getMaxIndex(starCount);
    const maxUsedLanguage = this.sortedLanguages[0];
    const total = Object.keys(languageUsed).map(key => languageUsed[key]).reduce((p, c) => p + c, 0);

    return (
      <CardGroup className={cardStyles['card_group']}>
        <InfoCard
          tipso={{
            text: githubTexts.maxReposCountLanguageTip.replace(/\$/, reposCount[maxReposCountIndex])
          }}
          mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
          subText={githubTexts.maxReposCountLanguage}
        />
        <InfoCard
          tipso={{
            text: githubTexts.maxUsageLanguageTip.replace(/\$/, (100 * languageUsed[maxUsedLanguage] / total).toFixed(2))
          }}
          mainText={maxUsedLanguage}
          subText={githubTexts.maxUsageLanguage}
        />
        <InfoCard
          mainText={Object.keys(languageSkills)[maxStarCountIndex]}
          subText={githubTexts.maxStarLanguage}
        />
      </CardGroup>
    );
  }

  setShowLanguage(language) {
    const { showLanguage } = this.state;
    const value = showLanguage === language ? null : language;
    this.setState({ showLanguage: value });
  }

  get sortedLanguages() {
    if (this.languages.length) { return this.languages }
    const { languageUsed } = this.props;
    this.languages = Object.keys(languageUsed).sort(sortLanguages(languageUsed)).slice(0, 6);
    return this.languages;
  }

  renderLanguagesLabel() {
    const { showLanguage } = this.state;
    const languages = this.sortedLanguages.map((language, index) => {
      return (
        <Label
          key={index}
          style={{
            backgroundColor: this.labelColor
          }}
          text={language}
          onClick={() => this.setShowLanguage(language)}
          active={language === showLanguage}
        />
    );
    });
    return (
      <div className={githubStyles["language_label_wrapper"]}>
        {languages}
      </div>
    );
  }

  renderLanguageReview() {
    const { showLanguage } = this.state;
    const { languageSkills } = this.props;
    const languages = Object.keys(languageSkills).filter(language => languageSkills[language] && language !== 'null');
    const sortedLanguages = this.sortedLanguages;
    const chartContainer = cx(
      githubStyles["repos_chart_container"],
      (languages.length || sortedLanguages.length) && githubStyles["with_chart"]
    );
    return (
      <div>
        {this.renderChartInfo()}
        <div className={chartContainer}>
          {sortedLanguages.length ? (
            <div className={githubStyles["repos_chart"]}>
              <canvas ref={ref => this.languageUsed = ref}></canvas>
            </div>
          ) : ''}
          {languages.length ? (
            <div className={githubStyles["repos_chart"]}>
              <canvas ref={ref => this.languageSkill = ref}></canvas>
            </div>
          ) : ''}
        </div>
        {this.renderLanguagesLabel()}
        { showLanguage ? this.renderShowRepos() : ''}
      </div>
    );
  }

  render() {
    const { loaded, className } = this.props;
    return (
      <div className={cx(cardStyles["info_card"], className)}>
        { !loaded ? (
          <Loading loading={true} />
        ) : this.renderLanguageReview()}
      </div>
    );
  }
}

LanguageInfo.defaultProps = {
  className: '',
  loaded: false,
  languageSkills: {},
  languageUsed: {},
  languageDistributions: {}
};

export default LanguageInfo;
