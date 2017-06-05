import React, { PropTypes } from 'react';
import cx from 'classnames';

import dateHelper from 'UTILS/date';
import { sortBySeconds } from 'UTILS/helper';
import validator from 'UTILS/validator';
import { LINK_NAMES } from 'SHARED/datas/resume';
import { objectassign } from 'SHARED/utils/resume';
import GithubComponent from 'SHARED/components/GithubComponent';
import styles from './styles/resume.css';
import locales from 'LOCALES';

const sortByDate = sortBySeconds('startTime');
const sortByEndDate = sortBySeconds('endTime');
const validateDate = dateHelper.validator.date;
const getSecondsByDate = dateHelper.seconds.getByDate;
const getDateNow = dateHelper.date.now;
const { hoursBefore } = dateHelper.relative;
const resumeTexts = locales("resume");

const DATE_NOW = getDateNow();
const DATE_NOW_SECONDS = getSecondsByDate(DATE_NOW);

const info = (options) => {
  const { text, icon, type, style = '' } = options;
  const component = options.component || null;

  return (
    <div className={cx(styles[`${type}_info`], style)}>
      <i className={cx(`fa fa-${icon}`, styles[`${type}_icon`])} aria-hidden="true"></i>
      &nbsp;&nbsp;
      {component ? component : text}
    </div>
  );
};

const linkInfo = (options) => {
  const { url, title, style = '' } = options;
  const hasUrl = validator.url(url);
  const headerClass = cx(
    styles["info_header"],
    hasUrl && styles.link,
    style
  );

  return hasUrl ? (
    <a target="_blank" href={validateUrl(url)} className={headerClass}>
      <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
      {title}
    </a>
  ) : (<div className={headerClass}>{title}</div>);
};

const validateUrl = url => /^http/.test(url) ? url : `//${url}`;

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

  renderEducations() {
    const { educations } = this.props.resume;

    const edus = educations
      .filter(edu => edu.school)
      .sort(sortByDate)
      .reverse()
      .map((edu, index) => {
        const { school, major, education, startTime, endTime} = edu;
        return (
          <div key={index} className={styles["section_wrapper"]}>
            <div className={cx(styles["info_header"], styles['info_header_large'])}>
              {school}{education ? `, ${education}` : ''}
            </div>
            <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
            <div className={styles["info_text"]}>{major}</div>
            {/* <div className={styles["section_dot"]}></div> */}
          </div>
        );
      });

    if (!edus.length) { return; }

    return (
      <div className={styles["section"]}>
        {titleInfo('教育经历', 'university')}
        <div className={styles["info_timeline"]}>
          {edus}
        </div>
      </div>
    );
  }

  renderWorkExperiences() {
    const { workExperiences } = this.props.resume;

    const exps = workExperiences
      .filter(experience => experience.company)
      .sort(sortByDate)
      .reverse()
      .map((experience, index) => {
        const { company, url, startTime, endTime, position, projects } = experience;
        const workProjects = this.renderProjects(projects);
        return (
          <div key={index} className={styles["section_wrapper"]}>
            {linkInfo({url, title: company, style: styles['info_header_large']})}
            {position ? `, ${position}` : ''}
            <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
            <div>{workProjects}</div>
            <div className={styles["section_dot"]}></div>
          </div>
        );
      });

    if (!exps.length) { return; }

    return (
      <div className={styles["section"]}>
        {titleInfo('工作经历', 'file-text-o')}
        <div className={styles["info_timeline"]}>
          {exps}
        </div>
      </div>
    );
  }

  renderProjects(projects) {
    return projects.map((project, index) => {
      const { name, url, details } = project;
      if (!name) { return; }
      const projectDetails = details.map((detail, i) => {
        return (
          <li key={i}>
            {detail}
          </li>
        );
      });
      return (
        <div key={index} className={styles["project_section"]}>
          {linkInfo({url, title: name, style: styles['info_header_mid']})}
          <ul className={styles["info_intro"]}>
            {projectDetails}
          </ul>
        </div>
      );
    });
  }

  renderPersonalProjects() {
    const { personalProjects } = this.props.resume;

    const projects = personalProjects
      .filter(project => project.title)
      .map((project, index) => {
        const { url, desc, techs, title } = project;
        const projectTechs = techs.map((tech, index) => {
          return (
            <div key={index} className={styles["info_label"]}>
              {tech}
            </div>
          );
        });
        return (
          <div key={index} className={styles["sec_section"]}>
            {linkInfo({url, title, style: styles['info_header_large']})}
            <div className={styles["info_text"]}>
              {desc}
            </div>
            <div className={styles["info_labels"]}>
              {projectTechs}
            </div>
          </div>
        );
      });

    if (!projects.length) { return; }

    return (
      <div className={styles["section"]}>
        {titleInfo('个人项目', 'code')}
        <div className={styles["info_wrapper"]}>
          {projects}
        </div>
      </div>
    );
  }

  renderSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) { return; }

    const personalSupplements = supplements.map((supplement, index) => {
      return (
        <li key={index}>
          {supplement}
        </li>
      );
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
    );
  }

  renderSocialLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;

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
                href={validateUrl(url)}>{url}</a>
            </div>
          </li>
        );
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
    );
  }

  renderLabels() {
    const { educations, workExperiences } = this.props.resume;
    const labels = [];
    if (educations.length) {
      const lastEducation = educations.sort(sortByEndDate).reverse()[0];
      const eduEndTime = lastEducation.endTime;
      if (getSecondsByDate(eduEndTime) >= DATE_NOW_SECONDS) {
        labels.push(
          <div className={styles["info_label"]} key={0}>在校</div>
        );
      }
    }

    if (workExperiences.length) {
      const lastWorkExperience = workExperiences.sort(sortByEndDate).reverse()[0];
      const workEndTime = lastWorkExperience.endTime;
      if (getSecondsByDate(workEndTime) >= DATE_NOW_SECONDS) {
        labels.push(
          <div className={styles["info_label"]} key={1}>在职</div>
        );
      }
    }

    if (labels.length) {
      return (
        <div className={styles["info_labels_container"]}>
          {labels}
        </div>
      );
    }
  }

  render() {
    const { showGithub } = this.state;
    const { resume, shareInfo, login } = this.props;
    const { info, others, updateAt } = resume;
    const { useGithub, github, githubUrl } = shareInfo;

    if (useGithub && showGithub) {
      return (
        <div className={styles["container"]}>
          <div
            className={cx(
              styles["github_wrapper"],
              showGithub && styles["github_wrapper_active"]
            )}>
            {baseInfo(null, 'arrow-left', {
              style: styles["base_info_header"],
              component: (
                <span
                  onClick={() => this.changeShowGithub(false)}>
                  返回
                </span>
              )
            })}
            <GithubComponent
              isShare={true}
              githubSection={github}
              containerStyle={styles["github_container"]}
              login={login}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles["container"]}>
        <div className={cx(
            styles["wrapper"]
        )}>
          <div className={styles["left"]}>
            {this.renderEducations()}
            {this.renderWorkExperiences()}
            {this.renderPersonalProjects()}
            {this.renderSupplements()}
            {this.renderSocialLinks()}
          </div>
          <div className={styles["right"]}>
            {baseInfo(info.name, info.gender, { style: styles["user_title"] })}
            {this.renderLabels()}<br/>
            {info.phone
              ? (baseInfo(info.phone, 'mobile', { style: styles["right_info"] }))
              : ''
            }
            {info.email
              ? (baseInfo(null, 'envelope-o', {
                component: (
                  <a href={`mailto:${info.email}`} className={styles["right_link"]}>{info.email}</a>
                )
              }))
              : ''}
            {baseInfo(`${info.location}   ${info.intention}`, 'map-marker', { style: styles["right_info"] })}
            {others.dream ? (
              <div className={styles["user_dream"]}>
                {baseInfo(others.dream, 'quote-left', { style: styles["right_info"] })}
              </div>
            ) : ''}
            {useGithub ? (
              baseInfo(null, 'github', {
                component: githubUrl ? (<a
                  href={githubUrl}
                  className={styles["right_link_info"]}>
                  查看我的 github 总结报告
                </a>) : (<a
                  onClick={() => this.changeShowGithub(true)}
                  className={styles["right_link_info"]}>
                  查看我的 github 总结报告
                </a>)
              })
            ) : ''}
            <br />
            {updateAt ? (
              baseInfo(
                `${resumeTexts.updateAt}${hoursBefore(updateAt)}`,
                'exclamation-circle',
                { style: styles["right_info_tip"] }
              )
            ) : ''}
          </div>
        </div>
      </div>
    );
  }
}

ResumeComponent.propTypes = {
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
  login: PropTypes.string
};

ResumeComponent.defaultProps = {
  resume: {},
  shareInfo: {},
  login: ''
};

export default ResumeComponent;
