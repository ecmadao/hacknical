import React from 'react';
import cx from 'classnames';
import objectAssign from 'UTILS/object-assign';
import { Loading } from 'light-ui';
import dateHelper from 'UTILS/date';
import validator from 'UTILS/validator';
import Slick from 'SHARED/components/Slick';
import styles from '../styles/resume.css';
import { GENDERS } from 'SHARED/datas/resume';
import { validateUrl } from 'UTILS/helper';
import locales from 'LOCALES';
import ResumeUIWrapper from 'SHARED/components/ResumeWrapper/ResumeUIWrapper';

const resumeLocales = locales('resume');
const { hoursBefore } = dateHelper.relative;
const { hasUrl } = validator;

const LINK_OPTIONS = {
  text: '',
  url: '',
  showIcon: true,
  icon: null,
  className: ''
};

const LinkInfo = (options = LINK_OPTIONS) => {
  const {
    text,
    url,
    icon,
    type,
    showIcon,
    className
  } = objectAssign({}, LINK_OPTIONS, options);
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={type === 'link' ? validateUrl(url) : url}
      className={cx(styles.linkText, className)}
    >
      {showIcon ? (
        icon
          ? <i className={`fa fa-${icon}`} aria-hidden="true" />
          : <i className="fa fa-link" aria-hidden="true" />
      ) : null}
      {text}
    </a>
  );
};

const HeaderInfo = (options = {}) => {
  const { url, text, showIcon } = options;
  if (showIcon === undefined) options.showIcon = false;
  if (url) {
    options.type = 'link';
    return LinkInfo(options);
  }
  return <div className={styles['project-header']}>{text}</div>;
};

class ResumeContent extends ResumeUIWrapper {
  renderHeader() {
    const { info, others } = this.props.resume;
    const { email, phone, name } = info;
    const { dream } = others;

    return (
      <div className={styles['section-header']}>
        <div className={styles.userName}>
          <div className={styles.maxText}>{name}</div>
          {dream ? <div className={styles.minText}>{dream}</div> : null}
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
      </div>
    );
  }

  renderEducations(key) {
    const { resume } = this.props;
    const { info, educations } = resume;

    const edus = educations
      .map((edu, index) => {
        const {
          major,
          school,
          endTime,
          startTime,
          education,
          experiences,
        } = edu;

        const experienceDetails = experiences.map((experience, i) => (
          <li key={i}>
            {experience}
          </li>
        ));
        return (
          <div className={styles['section-row']} key={index}>
            <div className={styles['row-left']}>
              {startTime}<br />~<br />{endTime}
            </div>
            <div className={cx(styles['row-right'], styles['right-container'])}>
              <div className={styles['right-header']}>
                <div className={styles.mainText}>{school}</div>
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
          </div>
        );
      });

    if (!edus.length) return null;
    return (
      <div className={styles['resume-section']} key={key}>
        {edus}
      </div>
    );
  }

  renderWorkExperiences(key) {
    const { workExperiences } = this.props.resume;

    const exps = workExperiences
      .map((experience, index) => {
        const {
          url,
          company,
          startTime,
          endTime,
          position,
          projects,
        } = experience;
        const workProjects = this.renderWorkProjects(projects);
        return (
          <div className={styles['section-row']} key={index}>
            <div className={styles['row-left']}>
              {startTime}
              <br />~<br />
              {endTime}
            </div>
            <div className={cx(styles['row-right'], styles['right-container'])}>
              <div className={styles['right-header']}>
                {HeaderInfo({
                  url,
                  text: company,
                  className: styles.mainLinkText
                })}
                {position ? <div className={styles.sideText}>{position}</div> : null}
              </div>
              <div className={styles['section-projects']}>
                {workProjects}
              </div>
            </div>
          </div>
        );
      });

    if (!exps.length) return null;
    return (
      <div className={styles['resume-section']} key={key}>
        {exps}
      </div>
    );
  }

  renderWorkProjects(projects) {
    return projects
      .filter(project => project.name)
      .map((project, index) => {
        const { name, url, details } = project;
        const projectDetails = details.map((detail, i) => (
          <li
            key={i}
            className={cx(
              hasUrl(detail) && styles['section-withlink']
            )}
          >
            {detail}
          </li>
        ));
        return (
          <div key={index} className={styles['section-project']}>
            {HeaderInfo({
              url,
              text: name,
              className: styles.sideLinkText
            })}
            <ul className={styles['section-list']}>
              {projectDetails}
            </ul>
          </div>
        );
      });
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume;

    const projects = personalProjects
      .map((project, index) => {
        const { desc, title } = project;
        return (
          <div className={styles['section-project']} key={index}>
            <div className={styles.mainText}>{title}</div>
            {desc ? (
              <div
                className={cx(
                  styles.minText,
                  hasUrl(desc) && styles['section-withlink']
                )}
              >
                {desc}
              </div>
            ) : null}
          </div>
        );
      });

    if (!projects.length) return null;
    return (
      <div className={styles['resume-section']} key={key}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            {resumeLocales.sections.projects.title}
          </div>
          <div className={cx(styles['row-right'], styles['right-container'])}>
            {projects}
          </div>
        </div>
      </div>
    );
  }

  renderSupplements(key) {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) return null;

    const personalSupplements = supplements.map((supplement, index) => (
      <li
        key={index}
        className={cx(
          hasUrl(supplement) && styles['section-withlink']
        )}
      >
        {supplement}
      </li>
    ));

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
    );
  }

  renderSlick() {
    const { loading, resume } = this.props;
    if (loading) return null;
    const { info, others } = resume;
    const { intention, location, gender } = info;
    const { expectLocation } = others;
    const sliders = [];
    if (intention) {
      sliders.push({
        mainText: intention,
        subText: resumeLocales.sections.info.job
      });
    }
    if (location) {
      sliders.push({
        mainText: location,
        subText: resumeLocales.sections.info.position
      });
    }
    if (expectLocation) {
      sliders.push({
        mainText: expectLocation,
        subText: resumeLocales.sections.others.expectCity
      });
    }
    return <Slick sliders={sliders} className={styles.slick} />;
  }

  renderUpdateTime() {
    const check = super.renderUpdateTime();
    if (!check) return null;
    const { updateText, updateAt } = check;
    return (
      <div className={styles.resumeTip} key="resumeTip">
        {updateText}{hoursBefore(updateAt)}
      </div>
    );
  }

  render() {
    const { resume, updateText } = this.props;
    const { updateAt, initialized } = resume;

    return (
      <div className={styles.resumeContainer}>
        {this.props.loading ? <Loading loading className={styles.resumeLoading} /> : ''}

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
                {resumeLocales.mobile.empty}<br/>{resumeLocales.mobile.tip}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}


export default ResumeContent;
