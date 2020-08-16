
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Label } from 'light-ui'
import locales, { switchLanguage, getLocale } from 'LOCALES'
import styles from '../Resume/shared/common.css'
import AsyncGithub from '../shared/AsyncGithub'
import Icon from 'COMPONENTS/Icon'
import { RESUME_SECTION_IDS } from 'UTILS/constant/resume'

const locale = getLocale()
const resumeLocales = locales('resume')

export const renderLabels = (labels, labelProps = {}, labelContainerClassName = '') => {
  if (!Array.isArray(labels) || labels.length === 0) return null

  const dom = labels.map((label, i) => (
    <Label
      min
      key={i}
      theme="flat"
      color="light"
      text={label}
      clickable={false}
      className={styles.label}
      {...labelProps}
    />
  ))

  return (
    <div className={cx(styles.labelContainer, labelContainerClassName)}>
      {dom}
    </div>
  )
}

class ResumeUIWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showGithub: false
    }
    this.changeShowGithub = this.changeShowGithub.bind(this)
  }

  changeShowGithub(showGithub) {
    this.setState({ showGithub })
  }

  getSectionTitle(section) {
    const { resume } = this.props
    const { info } = resume
    const { freshGraduate } = info
    const { title, subTitle } = resumeLocales.sections[section]
    const result = freshGraduate ? subTitle : title
    return result || title
  }

  renderEducations() {
    return null
  }

  renderWorkExperiences() {
    return null
  }

  renderPersonalProjects() {
    return null
  }

  renderOthers() {
    return [
      this.renderSupplements,
      this.renderSocialLinks
    ].map((func, index) => func && func.call(this, index))
  }

  renderSupplements() {
    return null
  }

  renderSocialLinks() {
    return null
  }

  renderUpdateTime() {
    const { resume, updateText, fromDownload } = this.props
    const { updateAt } = resume
    if (!updateAt || fromDownload) return false
    return {
      updateAt,
      updateText
    }
  }

  renderCustomModules() {
    const { resume } = this.props
    const { customModules = [] } = resume
    return customModules.map((module, index) => this.renderCustomModule(module, index))
  }

  renderCustomModule(module) {
    return key => {}
  }

  renderSection(section, resume) {
    switch (section.id) {
      case RESUME_SECTION_IDS.INFO:
        return () => {}
      case RESUME_SECTION_IDS.WORK_EXPERIENCE:
        return this.renderWorkExperiences
      case RESUME_SECTION_IDS.PERSONAL_PROJECTS:
        return this.renderPersonalProjects
      case RESUME_SECTION_IDS.EDUCATIONS:
        return this.renderEducations
      case RESUME_SECTION_IDS.OTHERS:
        return this.renderOthers
      default:
        if (section.tag !== RESUME_SECTION_IDS.CUSTOM) throw new Error(`Can not handle section ${JSON.stringify(section)}`)
        const module = resume.customModules.find(module => module.id === section.id)
        if (!module) return () => {}
        return this.renderCustomModule(module)
    }
  }

  renderResumeSections() {
    const { resume, shareInfo } = this.props

    return shareInfo.resumeSections
      .filter(section => section.enabled)
      .map((section, index) => this.renderSection(section, resume).call(this, index))
  }

  renderGitHub() {
    const { showGithub } = this.state
    const { shareInfo, login } = this.props
    const { useGithub } = shareInfo

    return useGithub && showGithub ? (
      <div className={styles.container}>
        <div className={styles.github_wrapper}>
          <a
            onClick={() => this.changeShowGithub(false)}
            className={cx(
              styles.baseLink,
              styles.baseInfo,
              styles.githubBack
            )}
          >
            <Icon icon="arrow-left" />
            {resumeLocales.options.back}
          </a>
          <AsyncGithub
            isShare
            login={login}
            cardClass={styles.githubCard}
          />
        </div>
      </div>
    ) : null
  }

  renderLanguages(labelProps = {}) {
    const { resume } = this.props
    const { info } = resume
    const resumeInfo = info || {}
    const { languages = [] } = resumeInfo

    return renderLabels(languages, labelProps)
  }

  renderResumeLanguages(className = '') {
    const { resume, fromDownload } = this.props
    if (fromDownload) return null

    const { languages = [] } = resume
    if (languages.length < 2) return null

    const languageDoms = languages.reduce((list, language, index) => {
      list.push(
        <span
          key={`language-${index}`}
          className={cx(
            styles.resumeLanguage,
            language.id === locale && styles.resumeLanguageActived
          )}
          onClick={() => switchLanguage(language.id)}
        >
          {language.text}
        </span>
      )
      if (languages[index + 1]) list.push('  /  ')
      return list
    }, [])

    return (
      <div className={cx(styles.resumeLanguages, className)}>
        {languageDoms}
      </div>
    )
  }
}

ResumeUIWrapper.propTypes = {
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
  login: PropTypes.string
}

ResumeUIWrapper.defaultProps = {
  resume: {},
  login: '',
  shareInfo: {}
}

export default ResumeUIWrapper
