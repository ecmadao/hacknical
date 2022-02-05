
import React from 'react'
import cx from 'classnames'
import { Label } from 'light-ui'
import dateHelper from 'UTILS/date'
import { renderTextWithUrl } from '../../shared/common'
import objectAssign from 'UTILS/object-assign'
import styles from './v1.css'
import statusLabels from '../../shared/StatusLabels'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'
import Avator from '../../shared/Avator'
import Favicon from 'COMPONENTS/Favicon'
import ResumeUIWrapper, { renderLabels } from 'SHARED/components/ResumeWrapper/ResumeUIWrapper'

const resumeLocales = locales('resume')
const { minutesBefore } = dateHelper.relative

const info = (options) => {
  const {
    text, icon, type, style = ''
  } = options
  const component = options.component || null

  return (
    <div className={cx(styles[`${type}_info`], style)}>
      <Icon icon={icon} className={styles[`${type}_icon`]} />
      &nbsp;&nbsp;
      {component || text}
    </div>
  )
}

const textInfo = (options) => {
  const { url, title, style = '' } = options
  const headerClass = cx(
    styles.info_header,
    url && styles.link,
    style
  )

  return url ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      className={headerClass}
    >
      <Icon icon="link" />&nbsp;
      {title}
    </a>
  ) : <div className={headerClass}>{title}</div>
}

const baseInfo = (text, icon, options = {}) => info(objectAssign({}, {
  text,
  icon,
  type: 'base',
  ...options
}))

const titleInfo = (text, icon, options = {}) => info(objectAssign({}, {
  text,
  icon,
  type: 'title',
  ...options
}))

class ResumeComponentV1 extends ResumeUIWrapper {
  renderEducations(key) {
    const { resume } = this.props
    const { info, educations } = resume

    const edus = educations
      .map((edu, index) => {
        const {
          types = [],
          major,
          school,
          endTime,
          education,
          startTime,
          experiences,
        } = edu

        const experienceDetails = experiences.map((experience, i) => (
          <li key={i}>
            {renderTextWithUrl(experience)}
          </li>
        ))
        return (
          <div key={index} className={styles.section_wrapper}>
            <div className={cx(styles.info_header, styles.info_header_large, styles.edu)}>
              {school}{education ? `, ${education}` : ''}
              &nbsp;&nbsp;
              {
                renderLabels(
                  types,
                  { color: 'darkLight', className: '' },
                  styles.labelContainerClassName
                )
              }
            </div>
            <div className={styles.info_text}>
              {startTime}  ~  {endTime}
            </div>
            <div className={styles.info_text}>{major}</div>
            {info.freshGraduate ? (
              <ul className={styles.info_intro}>
                {experienceDetails}
              </ul>
            ) : null}
          </div>
        )
      })
    if (!edus.length) return null

    return (
      <div className={styles.section} key={key}>
        {titleInfo(super.getSectionTitle('educations'), 'university')}
        <div className={styles.info_timeline}>
          {edus}
        </div>
      </div>
    )
  }

  renderWorkExperiences(key) {
    const { resume } = this.props
    const { workExperiences } = resume

    const exps = workExperiences
      .map((experience, index) => {
        const {
          url,
          techs,
          company,
          startTime,
          endTime,
          position,
          projects
        } = experience

        const workProjects = this.renderProjects(projects)
        return (
          <div key={index} className={styles.section_wrapper}>
            {textInfo({ url, title: company, style: styles.info_header_large })}
            {position ? `, ${position}` : ''}
            <div className={styles.info_text}>
              {startTime}  ~  {endTime}
            </div>
            {renderLabels(techs, { color: 'darkLight' })}
            <div>{workProjects}</div>
            <div className={styles.section_dot} />
          </div>
        )
      })
    if (!exps.length) return null

    return (
      <div className={styles.section} key={key}>
        {titleInfo(super.getSectionTitle('workExperiences'), 'file-text-o')}
        <div className={styles.info_timeline}>
          {exps}
        </div>
      </div>
    )
  }

  renderProjects(projects) {
    return projects.map((project, index) => {
      const { name, url, details } = project
      const projectDetails = details.map((detail, i) => (
        <li key={i}>
          {renderTextWithUrl(detail)}
        </li>
      ))
      return (
        <div key={index} className={styles.project_section}>
          {textInfo({ url, title: name, style: styles.info_header_mid })}
          <ul className={styles.info_intro}>
            {projectDetails}
          </ul>
        </div>
      )
    })
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume

    const projects = personalProjects
      .map((project, index) => {
        const {
          url, desc, techs, title
        } = project

        return (
          <div key={index} className={styles.sec_section}>
            {textInfo({ url, title, style: styles.info_header_large })}
            <div className={styles.info_text}>
              {desc}
            </div>
            <div className={styles.project_labels}>
              {renderLabels(techs, { color: 'darkLight' })}
            </div>
          </div>
        )
      })
    if (!projects.length) return null

    return (
      <div className={styles.section} key={key}>
        {titleInfo(super.getSectionTitle('personalProjects'), 'code')}
        <div className={styles.info_wrapper}>
          {projects}
        </div>
      </div>
    )
  }

  renderCustomModule(module) {
    return (key) => {
      const { sections } = module

      const doms = this.renderProjects(sections.map(section => ({
        url: section.url,
        name: section.title,
        details: section.details
      })))
      if (!doms.length) return null

      return (
        <div className={styles.section} key={key}>
          {titleInfo(module.text, 'file-text-o')}
          <div className={styles.info_wrapper}>
            {doms}
          </div>
        </div>
      )
    }
  }

  renderSupplements(key) {
    const { others } = this.props.resume
    const { supplements } = others
    if (!supplements.length) return null

    const personalSupplements = supplements.map((supplement, index) => (
      <li key={index}>
        {renderTextWithUrl(supplement)}
      </li>
    ))

    return (
      <div className={styles.section} key={key}>
        {titleInfo(resumeLocales.sections.others.selfAssessment, 'quote-left')}
        <div className={styles.info_wrapper}>
          <ul className={styles.info_intro}>
            {personalSupplements}
          </ul>
        </div>
      </div>
    )
  }

  renderSocialLinks(key) {
    const { others } = this.props.resume
    const { socialLinks } = others
    if (!socialLinks.length) return null

    const socials = socialLinks.map((social, index) => {
      const { url, text } = social
      return (
        <li key={index}>
          <div className={styles.link_wrapper}>
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
      <div className={styles.section} key={key}>
        {titleInfo(resumeLocales.sections.others.links.title, 'link')}
        <div className={styles.info_wrapper}>
          <ul className={styles.info_intro}>
            {socials}
          </ul>
        </div>
      </div>
    )
  }

  renderUpdateTime() {
    const check = super.renderUpdateTime()
    if (!check) return null
    const { updateText, updateAt } = check
    return baseInfo(
      `${updateText}${minutesBefore(updateAt)}`,
      'exclamation-circle',
      { style: styles.right_info_tip }
    )
  }

  render() {
    const { resume, shareInfo } = this.props
    const {
      info,
      others,
      educations,
      workExperiences
    } = resume
    const resumeInfo = info || {}
    const { useGithub, githubUrl } = shareInfo

    const its = resumeLocales.options.person[resumeInfo.gender] || resumeLocales.options.person.male
    const viewGitHub = resumeLocales.options.view.replace(/%s/, its)
    const githubSection = this.renderGitHub()
    if (githubSection) return githubSection

    return (
      <div className={styles.container}>
        {this.renderResumeLanguages(styles.resumeLanguages)}
        <div
          className={cx(
            styles.wrapper
          )}
        >
          <div className={styles.left}>
            {super.renderResumeSections.apply(this)}
          </div>
          <div className={styles.right}>
            <div className={styles.baseInfo}>
              <Avator src={resumeInfo.avator} className={styles.baseAvator} />
              <div className={styles.baseName}>
                {baseInfo(resumeInfo.name, resumeInfo.gender, { style: styles.user_title })}
                {statusLabels({
                  educations,
                  resumeInfo,
                  workExperiences
                })}
              </div>
            </div>
            <br />
            {resumeInfo.phone
              ? (baseInfo(resumeInfo.phone, 'mobile', { style: styles.right_info }))
              : null
            }
            {resumeInfo.email
              ? (baseInfo(null, 'envelope-o', {
                component: (
                  <a
                    href={`mailto:${resumeInfo.email}`}
                    className={styles.right_link}
                  >
                    {resumeInfo.email}
                  </a>
                )
              }))
              : null
            }
            {resumeInfo.location
              ? baseInfo(`${resumeInfo.location}   ${resumeInfo.intention}`, 'map-marker', { style: styles.right_info })
              : null
            }
            {this.renderLanguages({ color: 'light', theme: 'material' })}
            {others.dream ? (
              <div className={styles.user_dream}>
                {baseInfo(others.dream, 'quote-left', { style: styles.right_info })}
              </div>
            ) : null}
            {useGithub ? (
              baseInfo(null, 'github', {
                component: githubUrl ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.right_link_info}
                  >
                    {viewGitHub}
                  </a>
                ) : (
                  <a
                    onClick={() => this.changeShowGithub(true)}
                    className={styles.right_link_info}
                  >
                    {viewGitHub}
                  </a>
                )
              })
            ) : null}
            <br />
            {this.renderUpdateTime()}
          </div>
        </div>
      </div>
    )
  }
}

export default ResumeComponentV1
