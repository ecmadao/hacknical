
import React from 'react'
import cx from 'classnames'
import { Label } from 'light-ui'
import dateHelper from 'UTILS/date'
import styles from './v2.css'
import statusLabels from '../../shared/StatusLabels'
import locales from 'LOCALES'
import ResumeUIWrapper, { renderLabels } from 'SHARED/components/ResumeWrapper/ResumeUIWrapper'
import { renderBaseInfo, section, renderTextWithUrl } from '../../shared/common'
import Icon from 'COMPONENTS/Icon'
import Avator from '../../shared/Avator'
import Favicon from 'COMPONENTS/Favicon'

const resumeTexts = locales('resume')
const { minutesBefore } = dateHelper.relative

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

const renderPersonalProjectsRow = (options = {}) => {
  const { url, desc, techs, title, index } = options

  return (
    <div
      className={cx(
        styles.row,
        styles.projectRow
      )}
      key={index}
    >
      <div className={cx(styles.rowLeft, styles.textRight)}>
        {renderBaseInfo({
          url,
          type: 'link',
          value: title,
          className: styles.mainText
        })}
      </div>
      <div className={styles.rowRight}>
        <span
          className={cx(
            styles.subText,
            styles.subTextDark,
            styles.descContainer
          )}
        >
          {desc}
        </span>
        {renderLabels(techs, { color: 'darkLight' })}
      </div>
    </div>
  )
}

const renderWorkExperienceRow = (options = {}) => {
  const {
    url,
    techs,
    index,
    company,
    startTime,
    endTime,
    position,
    projects,
  } = options

  const workProjects = renderWorkProjects(projects)
  return (
    <div className={styles.row} key={index}>
      <div className={cx(styles.rowLeft, styles.textRight)}>
        {renderBaseInfo({
          url,
          type: 'link',
          value: company,
          className: styles.mainText
        })}
        <br />
        <span className={styles.subText}>
          {startTime}  ~  {endTime}
        </span>
        <div className={styles.labelsContainer}>
          {renderLabels(techs, { color: 'darkLight' })}
        </div>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.mainText}>{position}</span>
        <div>
          {workProjects}
        </div>
      </div>
    </div>
  )
}

class ResumeComponentV2 extends ResumeUIWrapper {
  renderEduRow(options) {
    const {
      types = [],
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
      <div className={styles.row} key={index}>
        <div className={cx(styles.rowLeft, styles.textRight)}>
          <div className={styles.edu}>
            <span className={styles.mainText}>{school}</span>
          </div>
          {
            renderLabels(
              types,
              { color: 'darkLight', className: '' },
              styles.labelContainerClassName
            )
          }
          <span className={styles.subText}>
            {startTime}  ~  {endTime}
          </span>
        </div>
        <div className={styles.rowRight}>
          <span className={styles.mainText}>{major}</span><br />
          <span className={styles.subText}>{education}</span>
          {freshGraduate ? (
            <ul className={styles.list}>
              {experiencesDetails}
            </ul>
          ) : null}
        </div>
      </div>
    )
  }

  renderEducations(key) {
    const { resume } = this.props
    const { info, educations } = resume
    const { freshGraduate } = info
    const edus = educations
      .map((edu, index) => this.renderEduRow({
        ...edu,
        index,
        freshGraduate,
      }))
    if (!edus.length) return null

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

  renderCustomModule(module) {
    return (key) => {
      const { sections } = module
      const exps = sections
        .map((section, index) => {
          const {
            url,
            title,
            details
          } = section

          const projectDetails = details.map((detail, i) => (
            <li key={i}>
              {renderTextWithUrl(detail)}
            </li>
          ))
          return (
            <div className={styles.row} key={index}>
              <div className={cx(styles.rowLeft, styles.textRight)}>
                {renderBaseInfo({
                  url,
                  type: 'link',
                  value: title,
                  className: styles.mainText
                })}
              </div>
              <div className={styles.rowRight}>
                <div>
                  <ul className={styles.list}>
                    {projectDetails}
                  </ul>
                </div>
              </div>
            </div>
          )
        })
      if (!exps.length) return null

      return section({
        key,
        rows: exps,
        title: module.text
      })
    }
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume

    const projects = personalProjects
      .map((project, index) => renderPersonalProjectsRow({
        ...project,
        index
      }))
    if (!projects.length) return null

    return section({
      key,
      rows: projects,
      title: super.getSectionTitle('personalProjects'),
    })
  }

  get supplements() {
    const { others } = this.props.resume
    const { supplements, socialLinks } = others
    if (!supplements.length) return null

    const personalSupplements = supplements.map((supplement, index) => (
      <li key={index}>
        {renderTextWithUrl(supplement)}
      </li>
    ))

    return (
      <div className={styles.sectionColumn}>
        {socialLinks.length > 0 && (
          <span className={styles.subTextDark}>
            {resumeTexts.sections.others.selfAssessment}
          </span>
        )}
        <ul className={styles.list}>
          {personalSupplements}
        </ul>
      </div>
    )
  }

  get links() {
    const { others } = this.props.resume
    const { supplements, socialLinks } = others
    if (!socialLinks.length) return null

    const socials = socialLinks.map((social, index) => {
      const { url, text } = social
      return (
        <li key={index}>
          <div className={styles.linkWrapper}>
            <Favicon src={social.validateUrl} name={text} />
            &nbsp;
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

    return (
      <div className={styles.sectionColumn}>
        {supplements.length > 0 && (
          <span className={styles.subTextDark}>
            {resumeTexts.sections.others.links.title}
          </span>
        )}
        <ul className={styles.list}>
          {socials}
        </ul>
      </div>
    )
  }

  renderSupplements(key) {
    const supplements = this.supplements
    const otherLinks = this.links
    const titles = []
    if (!supplements && !otherLinks) return null
    if (supplements) titles.push(resumeTexts.sections.others.selfAssessment)
    if (otherLinks) titles.push(resumeTexts.sections.others.links.title)

    const rows = [
      (<div className={styles.row} key={0}>
        {supplements}
        {otherLinks}
      </div>)
    ]
    return section({
      key,
      rows,
      title: titles.join(resumeTexts.sections.others.and),
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
            {this.renderResumeLanguages(styles.resumeLanguages)}
            <div className={styles.name}>
              <Avator src={info.avator} className={styles.baseAvator} />
              {info.name}
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
              {this.renderLanguages({ color: 'dark', theme: 'material' })}
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

export default ResumeComponentV2
