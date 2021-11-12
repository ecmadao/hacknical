
import React from 'react'
import cx from 'classnames'
import objectAssign from 'UTILS/object-assign'
import { Loading } from 'light-ui'
import dateHelper from 'UTILS/date'
import Slick from 'COMPONENTS/Slick'
import styles from './v3.css'
import { hasUrl } from 'UTILS/helper'
import { renderTextWithUrl } from '../../shared/common'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'
import Avator from '../../shared/Avator'
import Favicon from 'COMPONENTS/Favicon'
import ResumeUIWrapper, { renderLabels } from 'SHARED/components/ResumeWrapper/ResumeUIWrapper'

const resumeLocales = locales('resume')
const { hoursBefore } = dateHelper.relative

const LINK_OPTIONS = {
  text: '',
  url: '',
  showIcon: true,
  icon: null,
  className: ''
}

const LinkInfo = (options = LINK_OPTIONS) => {
  const {
    text,
    url,
    icon,
    showIcon,
    className
  } = objectAssign({}, LINK_OPTIONS, options)

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      className={cx(styles.linkText, className)}
    >
      <Icon icon={showIcon ? (icon || 'link') : null} />
      {text}
    </a>
  )
}

const HeaderInfo = (options = {}) => {
  const { url, text, showIcon } = options
  if (showIcon === undefined) options.showIcon = false
  if (url) {
    options.type = 'link'
    return LinkInfo(options)
  }
  return <div className={styles['project-header']}>{text}</div>
}

class ResumeContent extends ResumeUIWrapper {
  renderHeader() {
    const { info, others } = this.props.resume
    const { email, phone, name } = info
    const { dream } = others

    return (
      <div className={styles['section-header']}>
        <div className={styles.baseInfo}>
          <Avator src={info.avator} className={styles.baseAvator} />
          <div className={styles.userName}>
            <div className={styles.maxText}>{name}</div>
            {dream ? <div className={styles.minText}>{dream}</div> : null}
          </div>
        </div>
        {phone ? LinkInfo({
          text: phone,
          url: `tel:${phone}`,
          icon: 'mobile',
          showIcon: false,
          className: styles.contact
        }) : null}
        {email ? LinkInfo({
          text: email,
          url: `mailto:${email}`,
          showIcon: false,
          icon: 'envelope-o',
          className: styles.contact
        }) : null}
        <div>
          {this.renderLanguages({ color: 'darkLight' })}
        </div>
      </div>
    )
  }

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
          startTime,
          education,
          experiences
        } = edu

        const experienceDetails = experiences.map((experience, i) => (
          <li key={i}>
            {experience}
          </li>
        ))
        return (
          <div className={cx(styles['row-right'], styles['right-container'])} key={`edu-${index}`}>
            <div className={styles['right-header']}>
              <div className={cx(styles.mainText, styles.edu)}>
                {school}
                &nbsp;
                {
                  renderLabels(
                    types,
                    { color: 'darkLight', className: '' },
                    styles.labelContainerClassName
                  )
                }
              </div>
              <div className={styles.minText}>{startTime}~{endTime}</div>
              <div className={styles.sideText}>{education}</div>
              {major ? <div className={styles.sideText}>{major}</div> : null}
            </div>
            {experiences.length && info.freshGraduate ? (
              <div className={styles['section-projects']}>
                <div className={styles['section-project']}>
                  <ul className={styles['section-list']}>
                    {experienceDetails}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        )
      })

    if (!edus.length) return null
    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {super.getSectionTitle('educations')}
          </div>
          <div>{edus}</div>
        </div>
      </div>
    )
  }

  renderWorkExperiences(key) {
    const { workExperiences } = this.props.resume

    const exps = workExperiences
      .map((experience, index) => {
        const {
          url,
          techs,
          company,
          endTime,
          projects,
          position,
          startTime,
        } = experience
        const workProjects = this.renderWorkProjects(projects)

        return (
          <div className={cx(styles['row-right'], styles['right-container'])} key={`workExperience-${index}`}>
            <div className={styles['right-header']}>
              {HeaderInfo({
                url,
                text: company,
                className: styles.mainLinkText
              })}
              <div className={styles.minText}>{startTime}~{endTime}</div>
              {position ? <div className={styles.sideText}>{position}</div> : null}
              {renderLabels(techs, { color: 'darkLight' })}
            </div>
            <div className={styles['section-projects']}>
              {workProjects}
            </div>
          </div>
        )
      })

    if (!exps.length) return null
    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {super.getSectionTitle('workExperiences')}
          </div>
          <div>{exps}</div>
        </div>
      </div>
    )
  }

  renderWorkProjects(projects) {
    return projects
      .map((project, index) => {
        const { name, url, details } = project
        const projectDetails = details.map((detail, i) => (
          <li
            key={i}
            className={cx(
              hasUrl(detail) && styles['section-withlink']
            )}
          >
            {renderTextWithUrl(detail)}
          </li>
        ))

        return (
          <div key={index} className={styles['section-project']}>
            {HeaderInfo({
              url,
              text: name,
              showIcon: true,
              className: styles.sideLinkText
            })}
            <ul className={styles['section-list']}>
              {projectDetails}
            </ul>
          </div>
        )
      })
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume
    if (!personalProjects.length) return null

    const projects = personalProjects
      .map((project, index) => {
        const { desc, title, url } = project
        return (
          <div className={styles['section-project']} key={index}>
            {HeaderInfo({
              url,
              text: title,
              showIcon: true,
              className: styles.mainText
            })}
            {desc ? (
              <div
                className={cx(
                  styles.minText,
                  hasUrl(desc) && styles['section-withlink']
                )}
              >
                {renderTextWithUrl(desc)}
              </div>
            ) : null}
          </div>
        )
      })

    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {super.getSectionTitle('personalProjects')}
          </div>
          <div>
            <div className={cx(styles['row-right'], styles['right-container'])}>
              {projects}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSupplements(key) {
    const { others } = this.props.resume
    const { supplements } = others
    if (!supplements.length) return null

    const personalSupplements = supplements.map((supplement, index) => (
      <li
        key={index}
        className={cx(
          hasUrl(supplement) && styles['section-withlink']
        )}
      >
        {renderTextWithUrl(supplement)}
      </li>
    ))

    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {resumeLocales.sections.others.selfAssessment}
          </div>
          <div className={styles['row-right']}>
            <ul
              className={cx(
                styles['section-list'],
                styles.sideText,
                styles.stress
              )}
            >
              {personalSupplements}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderCustomModule(module) {
    return (key) => {
      const { sections } = module

      const projects = this.renderWorkProjects(sections.map(section => ({
        url: section.url,
        name: section.title,
        details: section.details
      })))
      if (!projects.length) return null

      return (
        <div className={styles['resume-section']} key={key}>
          <div className={styles['section-row']}>
            <div className={styles['row-left']}>
              {module.text}
            </div>
            <div>
              <div className={cx(styles['row-right'], styles['right-container'])}>
                {projects}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  renderSlick() {
    const { loading, resume } = this.props
    if (loading) return null

    const { info, others } = resume
    const { intention, location, gender } = info
    const { expectLocation } = others
    const sliders = []

    if (intention) {
      sliders.push({
        mainText: intention,
        subText: resumeLocales.sections.info.job
      })
    }
    if (location) {
      sliders.push({
        mainText: location,
        subText: resumeLocales.sections.info.position
      })
    }
    if (expectLocation) {
      sliders.push({
        mainText: expectLocation,
        subText: resumeLocales.sections.others.expectCity
      })
    }
    return <Slick sliders={sliders} className={styles.slick} />
  }

  renderUpdateTime() {
    const check = super.renderUpdateTime()
    if (!check) return null

    const { updateText, updateAt } = check
    return (
      <div className={styles.resumeTip} key="resumeTip">
        {updateText}{hoursBefore(updateAt)}
      </div>
    )
  }

  renderSocialLinks(key) {
    const { others } = this.props.resume
    const { socialLinks } = others
    if (!socialLinks.length) return null

    const linkDoms = []
    socialLinks.forEach((socialLink, i) => {
      const {
        url,
        text
      } = socialLink
      linkDoms.push((
        <li key={i}>
          <div className={styles.linkContainer}>
            <Favicon
              name={text}
              src={socialLink.validateUrl}
              className={styles.favicon}
            />
            &nbsp;
            {text}
            &nbsp;:
          </div>
          <br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={styles.listLink}
            href={socialLink.validateUrl}
          >
            {url}
          </a>
        </li>
      ))
    })

    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {resumeLocales.sections.others.links.title}
          </div>
          <div className={styles['row-right']}>
            <ul
              className={cx(
                styles['section-list'],
                styles.sideText,
                styles.stress
              )}
            >
              {linkDoms}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { resume } = this.props
    const { initialized } = resume

    return (
      <div className={styles.resumeContainer}>
        {this.props.loading ? <Loading loading className={styles.resumeLoading} /> : null}
        {this.renderResumeLanguages(styles.resumeLanguages)}
        {initialized ? ([
          (<div className={styles['header-section']} key="header">
            {this.renderHeader()}
            {this.renderSlick()}
           </div>),
          super.renderResumeSections.apply(this),
          this.renderUpdateTime()
        ]) : (
          <div className={styles['header-section']} key="placeholder">
            <div className={styles['header-placeholder']}>
              <img
                alt="no-resume"
                className={styles['header-image']}
                src={require('SRC/images/dead.png')}
              />
              <div className={styles['header-text']}>
                {resumeLocales.mobile.empty}<br />{resumeLocales.mobile.tip}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}


export default ResumeContent
