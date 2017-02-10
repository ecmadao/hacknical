import React, { PropTypes } from 'react';
import cx from 'classnames';

import dateHelper from 'UTILS/date';
import { sortByX } from 'UTILS/helper';
import validator from 'UTILS/validator';
import { LINK_NAMES } from 'SHAREDPAGE/datas/resume';
import { objectassign } from 'SHAREDPAGE/utils/resume';
import styles from './styles/resume.css';

const sortByDate = sortByX('startTime');
const validateDate = dateHelper.validator.date;

const info = (options) => {
  const { text, icon, type } = options;
  const style = options.style || '';
  const component = options.component || null;

  return (
    <div className={cx(styles[`${type}_info`], style)}>
      <i className={cx(`fa fa-${icon}`, styles[`${type}_icon`])} aria-hidden="true"></i>
      &nbsp;&nbsp;
      {component ? component : text}
    </div>
  )
};

const baseInfo = (text, icon, options = {}) => {
  return info(objectassign({}, {
    text,
    icon,
    type: 'base',
    ...options
  }));
};

const titleInfo = (text, icon, options = {}) => {
  return info(objectassign({}, {
    text,
    icon,
    type: 'title',
    ...options
  }));
};

class ResumeComponent extends React.Component {

  renderEducations() {
    const { educations } = this.props.resume;
    if (!educations.length) { return }

    const edus = educations.sort(sortByDate).reverse().map((edu, index) => {
      const { school, major, education, startTime, endTime} = edu;
      if (!school) { return }
      return (
        <div key={index} className={styles["section_wrapper"]}>
          <div className={styles["info_header"]}>{school}{education ? `, ${education}` : ''}</div>
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div className={styles["info_text"]}>{major}</div>
          <div className={styles["section_dot"]}></div>
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('教育经历', 'university')}
        <div className={styles["info_timeline"]}>
          {edus}
        </div>
      </div>
    )
  }

  renderWorkExperiences() {
    const { workExperiences } = this.props.resume;
    if (!workExperiences.length) { return }

    const exps = workExperiences.sort(sortByDate).reverse().map((experience, index) => {
      const { company, url, startTime, endTime, position, projects } = experience;
      if (!company) { return }
      const workProjects = this.renderProjects(projects);
      return (
        <div key={index} className={styles["section_wrapper"]}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles.link)}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {company}
            </a>
          ) : (<div className={styles["info_header"]}>{company}</div>)}
          {position ? `, ${position}` : ''}
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div>{workProjects}</div>
          <div className={styles["section_dot"]}></div>
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('工作经历', 'file-text-o')}
        <div className={styles["info_timeline"]}>
          {exps}
        </div>
      </div>
    )
  }

  renderProjects(projects) {
    return projects.map((project, index) => {
      const { name, details } = project;
      if (!name) { return }
      const projectDetails = details.map((detail, i) => {
        return (
          <li key={i}>
            {detail}
          </li>
        );
      });
      return (
        <div key={index} className={styles["project_section"]}>
          <div className={styles["info_section"]}>{name}</div>
          <ul className={styles["info_intro"]}>
            {projectDetails}
          </ul>
        </div>
      )
    });
  }

  renderPersonalProjects() {
    const { personalProjects } = this.props.resume;
    if (!personalProjects.length) { return }

    const projects = personalProjects.map((project, index) => {
      const { url, desc, techs, title } = project;
      const projectTechs = techs.map((tech, index) => {
        return (
          <div key={index} className={styles["info_label"]}>
            {tech}
          </div>
        );
      });
      return (
        <div key={index}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles.link)}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {title}
            </a>
          ) : (<div className={styles["info_header"]}>{title}</div>)}
          <div className={styles["info_text"]}>
            {desc}
          </div>
          <div className={styles["info_labels"]}>
            {projectTechs}
          </div>
        </div>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('个人项目', 'code')}
        <div className={styles["info_wrapper"]}>
          {projects}
        </div>
      </div>
    )
  }

  renderSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) { return }

    const personalSupplements = supplements.map((supplement, index) => {
      return (
        <li key={index}>
          {supplement}
        </li>
      )
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('自我评价', 'quote-left')}
        <div className={styles["info_wrapper"]}>
          <ul className={styles["info_intro"]}>
            {personalSupplements}
          </ul>
        </div>
      </div>
    )
  }

  renderSocialLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;
    if (!socialLinks.some(social => validator.url(social.url))) { return }

    const socials = socialLinks.map((social, index) => {
      if (validator.url(social.url)) {
        const { url, name, text } = social;
        return (
          <li key={index}>
            <div className={styles["link_wrapper"]}>
              {text || LINK_NAMES[name] || name}
              &nbsp;:&nbsp;&nbsp;&nbsp;
              <a
                target="_blank"
                className={styles["list_link"]}
                href={url[0] === 'h' ? url : `//${url}`}>{url}</a>
            </div>
          </li>
        )
      }
    });

    return (
      <div className={styles["section"]}>
        {titleInfo('其他链接', 'link')}
        <div className={styles["info_wrapper"]}>
          <ul className={styles["info_intro"]}>
            {socials}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const { resume } = this.props;
    const {
      info,
      others
    } = resume;
    return (
      <div className={styles["container"]}>
        <div className={styles["wrapper"]} id="resume">
          <div className={styles["left"]}>
            {this.renderEducations()}
            {this.renderWorkExperiences()}
            {this.renderPersonalProjects()}
            {this.renderSupplements()}
            {this.renderSocialLinks()}
          </div>
          <div className={styles["right"]}>
            {baseInfo(info.name, info.gender, { style: styles["user_title"] })}<br/>
            {baseInfo(info.phone, 'mobile')}
            {baseInfo(null, 'envelope-o', {
              component: (
                <a href={`mailto:${info.email}`} className={styles.link}>{info.email}</a>
              )
            })}
            {baseInfo(`${info.location}  ${info.intention}`, 'map-marker')}
            {others.dream ? (
              <div className={styles["user_dream"]}>
                {baseInfo(others.dream, 'quote-left')}
              </div>
            ) : ''}
          </div>
        </div>
      </div>
    )
  }
}

ResumeComponent.propTypes = {
  resume: PropTypes.object
};

ResumeComponent.defaultProps = {
  resume: {}
};

export default ResumeComponent;
