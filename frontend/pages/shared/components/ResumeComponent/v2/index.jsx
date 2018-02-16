import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Label } from 'light-ui';
import dateHelper from 'UTILS/date';
import styles from './resume_v2.css';
import { validateUrl } from 'UTILS/helper';
import statusLabels from '../shared/StatusLabels';
import AsyncGithub from '../shared/AsyncGithub';
import locales from 'LOCALES';
import { objectassign } from 'SHARED/utils/resume';
import ResumeUIWrapper from 'SHARED/components/ResumeWrapper/ResumeUIWrapper';

const resumeTexts = locales('resume');
const { hoursBefore } = dateHelper.relative;

const section = (options) => {
  const { key = '', title, rows, className = '' } = options;

  return (
    <div
      className={cx(
        styles.section,
        className
      )}
      key={key}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          {title}
        </div>
        <div className={styles.headerLine} />
      </div>
      {rows}
    </div>
  );
};

const renderBaseInfo = (options = {}) => {
  const {
    url,
    icon,
    value,
    type = 'normal',
    className = ''
  } = options;
  if (!value) return null;
  const iconDOM = icon
    ? <i className={`fa fa-${icon}`} aria-hidden="true" />
    : null;

  const linkClass = cx(
    styles.baseLink,
    styles.baseInfo,
    className
  );
  const textClass = cx(
    styles.baseInfo,
    className
  );
  if (type === 'email') {
    return (
      <a
        href={`mailto:${url}`}
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  } else if (type === 'phone') {
    return (
      <a
        href={`tel:${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  } else if (url) {
    return (
      <a
        href={validateUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {iconDOM}
        {value}
      </a>
    );
  }

  return (
    <span className={textClass}>
      {iconDOM}
      {value}
    </span>
  );
};

const renderProjects = (projects = []) =>
  projects.map((project, index) => {
    const { name, url, details } = project;
    const projectDetails = details.map((detail, i) => (
      <li key={i}>
        {detail}
      </li>
    ));
    return (
      <div key={index} className={styles.projectSection}>
        {renderBaseInfo({
          url,
          value: name,
          className: styles.subTextDark
        })}
        <ul className={styles.list}>
          {projectDetails}
        </ul>
      </div>
    );
  });


const renderPersonalProjectsRow = (options = {}) => {
  const { url, desc, techs, title, index } = options;

  const projectTechs = techs.map((tech, i) => (
    <Label
      min
      key={i}
      text={tech}
      clickable={false}
      color="darkLight"
      className={styles.label}
    />
  ));
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
        <div>
          {projectTechs}
        </div>
      </div>
    </div>
  );
};

const renderWorkExperienceRow = (options = {}) => {
  const {
    url,
    index,
    company,
    startTime,
    endTime,
    position,
    projects,
  } = options;

  const workProjects = renderProjects(projects);
  return (
    <div className={styles.row} key={index}>
      <div className={cx(styles.rowLeft, styles.textRight)}>
        {renderBaseInfo({
          url,
          value: company,
          className: styles.mainText
        })}
        <br />
        <span className={styles.subText}>
          {startTime}  ~  {endTime}
        </span>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.mainText}>{position}</span>
        <div>
          {workProjects}
        </div>
      </div>
    </div>
  );
};

const renderEduRow = (options = {}) => {
  const {
    major,
    index,
    school,
    endTime,
    education,
    startTime,
    experiences,
    freshGraduate,
  } = options;

  const experiencesDetails = experiences.map((experience, i) => (
    <li key={i}>
      {experience}
    </li>
  ));
  return (
    <div className={styles.row} key={index}>
      <div className={cx(styles.rowLeft, styles.textRight)}>
        <span className={styles.mainText}>{school}</span><br />
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
  );
};

class ResumeComponentV2 extends ResumeUIWrapper {
  constructor(props) {
    super(props);
    this.state = {
      showGithub: false
    };
    this.changeShowGithub = this.changeShowGithub.bind(this);
  }

  changeShowGithub(showGithub) {
    this.setState({ showGithub });
  }

  renderEducations(key) {
    const { resume } = this.props;
    const { info, educations } = resume;
    const { freshGraduate } = info;
    const edus = educations
      .map((edu, index) => renderEduRow({
        ...edu,
        index,
        freshGraduate,
      }));

    return section({
      key,
      rows: edus,
      className: styles.firstSection,
      title: super.getSectionTitle('edu')
    });
  }

  renderWorkExperiences(key) {
    const { resume } = this.props;
    const { workExperiences } = resume;
    const exps = workExperiences
      .map((experience, index) => renderWorkExperienceRow({
        ...experience,
        index
      }));

    return section({
      key,
      rows: exps,
      title: super.getSectionTitle('work')
    });
  }

  renderPersonalProjects(key) {
    const { personalProjects } = this.props.resume;

    const projects = personalProjects
      .map((project, index) => renderPersonalProjectsRow({
        ...project,
        index
      }));

    return section({
      key,
      rows: projects,
      title: resumeTexts.sections.projects.title,
    });
  }

  getSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) return null;

    const personalSupplements = supplements.map((supplement, index) => (
      <li key={index}>
        {supplement}
      </li>
    ));

    return (
      <div className={styles.sectionColumn}>
        <span className={styles.subTextDark}>
          {resumeTexts.sections.others.selfAssessment}
        </span>
        <ul className={styles.list}>
          {personalSupplements}
        </ul>
      </div>
    );
  }

  getLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;
    if (!socialLinks.length) return null;

    const socials = socialLinks.map((social, index) => {
      const { url, text } = social;
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
      );
    });

    return (
      <div className={styles.sectionColumn}>
        <span className={styles.subTextDark}>
          {resumeTexts.sections.others.links.title}
        </span>
        <ul className={styles.list}>
          {socials}
        </ul>
      </div>
    );
  }

  renderSupplements(key) {
    const supplements = this.getSupplements();
    const otherLinks = this.getLinks();
    const titles = [];
    if (!supplements && !otherLinks) return null;
    if (supplements) titles.push(resumeTexts.sections.others.selfAssessment);
    if (otherLinks) titles.push(resumeTexts.sections.others.links.title);

    const rows = [
      (<div className={styles.row} key={0}>
        {supplements}
        {otherLinks}
      </div>)
    ];
    return section({
      key,
      rows,
      title: titles.join(resumeTexts.sections.others.and),
    });
  }

  renderUpdateTime() {
    const check = super.renderUpdateTime();
    if (!check) return null;
    const { updateText, updateAt } = check;
    return (
      <div className={styles.footerRight}>
        {updateText}{hoursBefore(updateAt)}
      </div>
    );
  }

  render() {
    const { showGithub } = this.state;
    const { resume, shareInfo, login, updateText } = this.props;
    const { info, others, updateAt, educations, workExperiences } = resume;
    const { useGithub, github, githubUrl } = shareInfo;
    const its = info.gender === 'male'
      ? resumeTexts.options.person.male
      : resumeTexts.options.person.female;
    const viewGitHub = resumeTexts.options.view.replace(/%s/, its);

    if (useGithub && showGithub) {
      return (
        <div className={styles.container}>
          <div
            className={cx(
              styles.github_wrapper,
              showGithub && styles.github_wrapper_active
            )}
          >
            <a
              onClick={() => this.changeShowGithub(false)}
              className={cx(
                styles.baseLink,
                styles.baseInfo,
                styles.githubBack
              )}
            >
              <i className="fa fa-arrow-left" aria-hidden="true" />
              {resumeTexts.options.back}
            </a>
            <AsyncGithub
              isShare
              login={login}
              githubSection={github}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.name}>{info.name}</div>
            {statusLabels({
              educations,
              workExperiences,
              labelColor: 'dark',
              resumeInfo: info || {}
            })}
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
                      <i className="fa fa-github" aria-hidden="true" />
                      {viewGitHub}
                    </a>
                  )
                )
              }
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
    );
  }
}

ResumeComponentV2.propTypes = {
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
  login: PropTypes.string
};

ResumeComponentV2.defaultProps = {
  resume: {},
  shareInfo: {},
  login: ''
};

export default ResumeComponentV2;
