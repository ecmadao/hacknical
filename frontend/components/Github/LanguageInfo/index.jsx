import React from 'react';
import cx from 'classnames';
import Chart from 'chart.js';
import {
  Label,
  Loading,
  InfoCard,
  CardGroup,
} from 'light-ui';
import locales from 'LOCALES';
import chart from 'UTILS/chart';
import github from 'UTILS/github';
import { randomColor } from 'UTILS/colors';
import { getMaxIndex } from 'UTILS/helper';
import githubStyles from '../styles/github.css';
import cardStyles from '../styles/info_card.css';
import ReposRowInfo from '../ReposRowInfo';

const sortByLanguageStar = github.sortByX({ key: 'star' });
const githubTexts = locales('github.sections.languages');
const getRamdomColor = randomColor();

class LanguageInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLanguage: null
    };
    this.languages = [];
    this.labelColor = getRamdomColor('LanguageInfo');
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
      !this.languageUsedChart
        && this.languageUsed
        && this.renderLanguageUsedChart();
      !this.languageSkillChart
        && this.languageSkill
        && this.renderLanguageSkillsChart();
    }
  }

  renderLanguageUsedChart() {
    const { languageUsed } = this.props;
    const languages = this.sortedLanguages;
    let total = 0;
    languages.forEach(key => (total += languageUsed[key]));
    const languagePercentage = languages.map(
      language => languageUsed[language] / total
    );

    this.languageUsedChart = new Chart(this.languageUsed, {
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
            label: item => `${githubTexts.usageChart.label}${(item.yLabel * 100).toFixed(2)}%`
          }
        }
      }
    });
  }

  renderLanguageSkillsChart() {
    const { languageSkills } = this.props;
    const languages = [];
    const skills = [];
    const languageArray = Object.keys(languageSkills)
      .filter(language => languageSkills[language] && language !== 'null')
      .slice(0, 6)
      .map(language => ({ star: languageSkills[language], language }))
      .sort(sortByLanguageStar);

    for (const obj of languageArray) {
      languages.push(obj.language);
      skills.push(obj.star);
    }

    this.languageSkillChart = new Chart(this.languageSkill, {
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
      }
    });
  }

  renderShowRepos() {
    const { repositories } = this.props;
    const { showLanguage } = this.state;
    const targetRepositories = github
      .getReposByLanguage(repositories, showLanguage)
      .map((repository, index) => (
        <ReposRowInfo
          key={index}
          repository={repository}
        />
      ));
    return (
      <div className={githubStyles.repos_show_container}>
        <p className={githubStyles.repos_show_title}>
          {showLanguage}&nbsp;
          <span>{githubTexts.relativeRepos}</span>
        </p>
        {targetRepositories}
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
    const total = Object.keys(languageUsed)
      .map(key => languageUsed[key])
      .reduce((p, c) => p + c, 0);

    return (
      <CardGroup className={cardStyles.card_group}>
        <InfoCard
          tipso={{
            text: githubTexts.maxReposCountLanguageTip.replace(/\$/, reposCount[maxReposCountIndex])
          }}
          tipsoTheme="dark"
          mainText={Object.keys(languageDistributions)[maxReposCountIndex]}
          subText={githubTexts.maxReposCountLanguage}
        />
        <InfoCard
          tipso={{
            text: githubTexts.maxUsageLanguageTip
              .replace(/\$/, ((100 * languageUsed[maxUsedLanguage]) / total)
              .toFixed(2))
          }}
          tipsoTheme="dark"
          mainText={maxUsedLanguage}
          subText={githubTexts.maxUsageLanguage}
        />
        <InfoCard
          tipsoTheme="dark"
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
    if (this.languages.length) this.languages;
    const { languageUsed } = this.props;
    this.languages = Object.keys(languageUsed)
      .sort(github.sortByLanguage(languageUsed))
      .slice(0, 6);
    return this.languages;
  }

  renderLanguagesLabel() {
    const { showLanguage } = this.state;
    const languages = this.sortedLanguages.map((language, index) => (
      <Label
        key={index}
        style={{
          backgroundColor: this.labelColor
        }}
        text={language}
        className={githubStyles.languageLabel}
        onClick={() => this.setShowLanguage(language)}
        active={language === showLanguage}
      />
    ));
    return (
      <div className={githubStyles.languageLabelWrapper}>
        {languages}
      </div>
    );
  }

  renderLanguageReview() {
    const { showLanguage } = this.state;
    const { languageSkills } = this.props;
    const languages = Object.keys(languageSkills)
      .filter(language => languageSkills[language] && language !== 'null');
    const sortedLanguages = this.sortedLanguages;
    const chartContainer = cx(
      githubStyles.repos_chart_container,
      (languages.length || sortedLanguages.length) && githubStyles.with_chart
    );
    return (
      <div>
        {this.renderChartInfo()}
        <div className={chartContainer}>
          {sortedLanguages.length ? (
            <div className={githubStyles.repos_chart}>
              <canvas
                className={githubStyles.radarChart}
                ref={ref => (this.languageUsed = ref)}
              />
            </div>
          ) : null}
          {languages.length ? (
            <div className={githubStyles.repos_chart}>
              <canvas
                className={githubStyles.radarChart}
                ref={ref => (this.languageSkill = ref)}
              />
            </div>
          ) : null}
        </div>
        {this.renderLanguagesLabel()}
        { showLanguage ? this.renderShowRepos() : null}
      </div>
    );
  }

  render() {
    const { loaded, className } = this.props;
    return (
      <div className={className}>
        { !loaded ? <Loading loading /> : this.renderLanguageReview()}
      </div>
    );
  }
}

LanguageInfo.defaultProps = {
  repositories: [],
  className: '',
  loaded: false,
  languageSkills: {},
  languageUsed: {},
  languageDistributions: {}
};

export default LanguageInfo;
