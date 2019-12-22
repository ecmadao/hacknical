
import React from 'react'
import cx from 'classnames'
import { Label } from 'light-ui'
import dateHelper from 'UTILS/date'
import styles from './v3.css'
import statusLabels from '../../shared/StatusLabels'
import locales from 'LOCALES'
import ResumeUIWrapper from 'SHARED/components/ResumeWrapper/ResumeUIWrapper'
import { renderBaseInfo, section, renderTextWithUrl } from '../../shared/common'
import Icon from 'COMPONENTS/Icon'
import Avator from 'COMPONENTS/Avator'

const resumeTexts = locales('resume')
const { minutesBefore } = dateHelper.relative

const renderPersonalProjectsRow = (options) => {
  const { url, desc, techs, title, index } = options

  const projectTechs = techs.map((tech, i) => (
    <Label
      min
      key={i}
      text={tech}
      clickable={false}
      color="darkLight"
      className={styles.label}
    />
  ))
  return (
    <div
      className={cx(
        styles.column,
        styles.sectionColumn,
        styles.projectColumn,
      )}
      key={index}
    >
      {renderBaseInfo({
        url,
        type: 'link',
        value: title,
        className: styles.mainText
      })}
      <div>
        <span
          className={cx(
            styles.subText,
            styles.subTextLightDark,
            styles.descContainer
          )}
        >
          {desc}
        </span>
        <div>
          {projectTechs}
        </div>
      </div>
    </div>
  )
}

const renderWorkProjects = (projects = []) =>
  projects.map((project, index) => {
    const { name, url, details } = project
    const projectDetails = details.map((detail, i) => (
      <li key={i}>
        {renderTextWithUrl(detail)}
      </li>
    ))
    return (
      <div key={index} className={styles.projectSection}>
        {renderBaseInfo({
          url,
          type: 'link',
          value: name,
          className: styles.subTextDark
        })}
        <ul className={styles.list}>
          {projectDetails}
        </ul>
      </div>
    )
  })

const renderWorkExperienceRow = (options) => {
  const {
    url,
    index,
    company,
    startTime,
    endTime,
    position,
    projects
  } = options

  const workProjects = renderWorkProjects(projects)
  return (
    <div className={cx(styles.column, styles.sectionColumn)} key={index}>
      <div className={styles.row}>
        <div className={styles.rowHeader}>
          {renderBaseInfo({
            url,
            type: 'link',
            value: company,
            className: styles.mainText
          })}
        </div>
        <span className={styles.subText}>
          {startTime}  ~  {endTime}
        </span>
      </div>
      <span className={styles.subText}>{position}</span>
      {workProjects}
    </div>
  )
}

const renderEduRow = (options) => {
  const {
    major,
    index,
    school,
    endTime,
    education,
    startTime,
    experiences,
    freshGraduate,
  } = options

  const experiencesDetails = experiences.map((experience, i) => (
    <li key={i}>
      {renderTextWithUrl(experience)}
    </li>
  ))
  return (
    <div className={cx(styles.column, styles.sectionColumn)} key={index}>
      <div className={styles.row}>
        <div className={styles.rowHeader}>
          {renderBaseInfo({
            value: school,
            className: styles.mainText
          })}
        </div>
        <span className={styles.subText}>
          {startTime}  ~  {endTime}
        </span>
      </div>
      <span className={styles.subText}>{education} - {major}</span>
      {freshGraduate ? (
        <ul className={styles.list}>
          {experiencesDetails}
        </ul>
      ) : null}
    </div>
  )
}

class ResumeComponentV3 extends ResumeUIWrapper {
  renderSocialLinks(key) {
    const { others } = this.props.resume
    const { socialLinks } = others
    if (!socialLinks.length) return null

    const socials = socialLinks.map((social, index) => {
      const { url, text } = social
      return (
        <li key={index}>
          <div className={styles.link_wrapper}>
            {text}
            &nbsp;:&nbsp;&nbsp;&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={styles.list_link}
              href={social.validateUrl}
            >
              {url}
            </a>
          </div>
        </li>
      )
    })

    return section({
      key,
      rows: [(
        <ul className={styles.list} key={0}>
          {socials}
        </ul>
      )],
      title: resumeTexts.sections.others.links.title,
    })
  }

  renderSupplements(key) {
    const { others } = this.props.resume
    const { supplements } = others

    const personalSupplements = supplements.map((supplement, index) => (
      <li key={index}>
        {renderTextWithUrl(supplement)}
      </li>
    ))

    return section({
      key,
      rows: [(
        <ul className={styles.list} key={0}>
          {personalSupplements}
        </ul>
      )],
      title: resumeTexts.sections.others.selfAssessment,
    })
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume

    const projects = personalProjects
      .map((project, index) => renderPersonalProjectsRow({
        ...project,
        index
      }))

    return section({
      key,
      rows: projects,
      title: super.getSectionTitle('personalProjects'),
    })
  }

  renderEducations(key) {
    const { resume } = this.props
    const { info, educations } = resume
    const { freshGraduate } = info
    const edus = educations
      .map((edu, index) => renderEduRow({
        ...edu,
        index,
        freshGraduate,
      }))

    return section({
      key,
      rows: edus,
      title: super.getSectionTitle('educations')
    })
  }

  renderWorkExperiences(key) {
    const { resume } = this.props
    const { workExperiences } = resume
    const exps = workExperiences
      .map((experience, index) => renderWorkExperienceRow({
        ...experience,
        index
      }))
    if (!exps.length) return null

    return section({
      key,
      rows: exps,
      title: super.getSectionTitle('workExperiences')
    })
  }

  renderCustomModule(module, key) {
    const { sections } = module
    const exps = sections
      .map((section, index) => {
        const {
          url,
          title,
          details,
        } = section

        const projectDetails = details.map((detail, i) => (
          <li key={i}>
            {renderTextWithUrl(detail)}
          </li>
        ))
        return (
          <div className={cx(styles.column, styles.sectionColumn)} key={index}>
            <div className={styles.row}>
              <div className={styles.rowHeader}>
                {renderBaseInfo({
                  url,
                  type: 'link',
                  value: title,
                  className: styles.mainText
                })}
              </div>
            </div>
            <ul className={styles.list}>
              {projectDetails}
            </ul>
          </div>
        )
      })

    return section({
      key,
      rows: exps,
      title: module.text
    })
  }

  renderUpdateTime() {
    const check = super.renderUpdateTime()
    if (!check) return null
    const { updateText, updateAt } = check
    return (
      <div className={styles.footerRight}>
        {updateText}{minutesBefore(updateAt)}
      </div>
    )
  }

  render() {
    const { resume, shareInfo } = this.props
    const { info, others, educations, workExperiences } = resume
    const { useGithub, githubUrl } = shareInfo

    const its = resumeTexts.options.person[info.gender] || resumeTexts.options.person.male
    const viewGitHub = resumeTexts.options.view.replace(/%s/, its)
    const githubSection = this.renderGitHub()
    if (githubSection) return githubSection

    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.name}>
              {info.name}
              <Avator src={info.avator} className={styles.baseAvator} />
            </div>
            {statusLabels({
              educations,
              workExperiences,
              labelColor: 'dark',
              resumeInfo: info || {}
            })}
            <div className={styles.headerInfoContainer}>
              {renderBaseInfo({
                value: info.location,
                className: styles.headerInfo,
              })}
              {renderBaseInfo({
                value: info.intention,
                className: styles.headerInfo,
              })}
              {
                useGithub && (
                  githubUrl ? renderBaseInfo({
                    type: 'link',
                    url: githubUrl,
                    icon: 'github',
                    value: viewGitHub
                  }) : (
                    <a
                      onClick={() => this.changeShowGithub(true)}
                      className={cx(
                        styles.baseLink,
                        styles.baseInfo
                      )}
                    >
                      <Icon icon="github" />
                      {viewGitHub}
                    </a>
                  )
                )
              }
            </div>
            <div className={styles.headerInfoContainer}>
              {renderBaseInfo({
                url: info.phone,
                value: info.phone,
                icon: 'mobile',
                type: 'mobile',
                className: styles.headerInfo,
              })}
              {renderBaseInfo({
                url: info.email,
                value: info.email,
                icon: 'envelope-o',
                type: 'email',
                className: styles.headerInfo,
              })}
            </div>
            <div className={styles.headerInfoContainer}>
              {this.renderLanguages({ color: 'darkLight' })}
            </div>
          </div>
          {super.renderResumeSections.apply(this)}
        </div>
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {others.dream}
          </div>
          {this.renderUpdateTime()}
        </div>
      </div>
    )
  }
}

export default ResumeComponentV3
