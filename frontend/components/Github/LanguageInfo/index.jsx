import React from 'react'
import {
  Label,
  Loading,
  InfoCard,
  CardGroup
} from 'light-ui'
import cx from 'classnames'
import locales from 'LOCALES'
import github from 'UTILS/github'
import { randomColor } from 'UTILS/colors'
import { getMaxIndex } from 'UTILS/helper'
import githubStyles from '../styles/github.css'
import cardStyles from '../styles/info_card.css'
import ReposRowInfo from '../ReposRowInfo'
import LanguageLines from 'COMPONENTS/GitHub/LanguageLines'

const githubTexts = locales('github.sections.languages')
const getRamdomColor = randomColor('LanguageLines')

class LanguageInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showLanguage: null
    }
    this.languages = []
    this.setShowLanguage = this.setShowLanguage.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { loaded } = this.props
    if (!loaded && nextProps.loaded) {
      this.setState({
        showLanguage: Object.keys(this.props.data.languages || {})
          .sort(github.sortByLanguage(this.props.data.languages || {}))[0]
      })
    }
  }

  renderShowRepos() {
    const { repositories } = this.props.data
    const { showLanguage } = this.state
    const targetRepositories = github
      .getReposByLanguage(repositories, showLanguage)
      .map((repository, index) => (
        <ReposRowInfo
          key={index}
          repository={repository}
        />
      ))
    return (
      <div className={githubStyles.repos_show_container}>
        <p className={githubStyles.repos_show_title}>
          {showLanguage}&nbsp;
          <span>{githubTexts.relativeRepos}</span>
        </p>
        {targetRepositories}
      </div>
    )
  }

  renderBaseInfo() {
    const { languageDistributions, languageSkills, languageUsed } = this.props.data

    const reposCount = Object.keys(languageDistributions).map(key => languageDistributions[key])
    const starCount = Object.keys(languageSkills).map(key => languageSkills[key])
    const maxReposCountIndex = getMaxIndex(reposCount)
    const maxStarCountIndex = getMaxIndex(starCount)
    const maxUsedLanguage = this.sortedLanguages[0]
    const total = Object.keys(languageUsed)
      .map(key => languageUsed[key])
      .reduce((p, c) => p + c, 0)

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
    )
  }

  setShowLanguage(language) {
    const { showLanguage } = this.state
    const value = showLanguage === language ? null : language
    this.setState({ showLanguage: value })
  }

  get sortedLanguages() {
    if (this.languages.length) this.languages
    const { languageUsed, languages } = this.props.data

    let datas = languages
    if (!datas || Object.keys(datas).length === 0) datas = languageUsed
    this.languages = Object.keys(datas)
      .sort(github.sortByLanguage(datas))
    return this.languages
  }

  renderLanguagesLabel(showCount) {
    const { showLanguage } = this.state
    const languages = this.sortedLanguages.slice(0, showCount).map((language, index) => (
      <Label
        key={index}
        style={{
          backgroundColor: getRamdomColor(language),
          borderColor: getRamdomColor(language)
        }}
        text={language}
        className={cx(
          githubStyles.languageLabel,
          language === showLanguage && githubStyles.active
        )}
        onClick={() => this.setShowLanguage(language)}
        active={language === showLanguage}
      />
    ))
    return (
      <div className={githubStyles.languageLabelWrapper}>
        {languages}
      </div>
    )
  }

  renderLanguageReview() {
    const { showLanguage } = this.state
    const { loaded } = this.props
    const { languages, languageUsed } = this.props.data
    const showCount = 9
    return (
      <div>
        {this.renderBaseInfo()}
        <div>
          <LanguageLines
            showCount={showCount}
            loaded={loaded}
            languages={languages}
            languageUsed={languageUsed}
          />
        </div>
        {this.renderLanguagesLabel(showCount)}
        {showLanguage ? this.renderShowRepos() : null}
      </div>
    )
  }

  render() {
    const { loaded, className } = this.props

    return (
      <div className={className}>
        {!loaded ? <Loading loading /> : this.renderLanguageReview()}
      </div>
    )
  }
}

LanguageInfo.defaultProps = {
  className: '',
  loaded: false,
  data: {
    repositories: [],
    languageSkills: {},
    languageUsed: {},
    languageDistributions: {}
  }
}

export default LanguageInfo
