import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Label } from 'light-ui';
import { sortBySeconds } from 'UTILS/helper';
import dateHelper from 'UTILS/date';
import styles from './resume_v2.css';
import validator from 'UTILS/validator';
import { LINK_NAMES } from 'SHARED/datas/resume';
import GithubComponent from 'SHARED/components/GithubComponent';

const validateDate = dateHelper.validator.date;
const getDateNow = dateHelper.date.now;
const sortByDate = sortBySeconds('startTime');
const DATE_NOW = getDateNow();

const validateUrl = url => /^http/.test(url) ? url : `//${url}`;

const section = (options) => {
  const { title, rows, className = '' } = options;

  return (
    <div className={cx(
        styles.section,
        className
      )}>
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
  if (!value)return null;
  const iconDOM = icon
    ? (<i className={`fa fa-${icon}`} aria-hidden="true"></i>)
    : '';

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

const renderProjects = (projects = []) => {
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
      <div key={index} className={styles.projectSection}>
        {renderBaseInfo({
          url,
          value: name,
          className: styles.subText
        })}
        <ul className={styles.list}>
          {projectDetails}
        </ul>
      </div>
    );
  });
};

const renderPersonalProjectsRow = (options = {}) => {
  const { url, desc, techs, title, index } = options;

  const projectTechs = techs.map((tech, i) => {
    return (
      <Label
        min
        key={i}
        text={tech}
        clickable={false}
        color="darkLight"
        className={styles.label}
      />
    );
  });
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
    untilNow,
  } = options;

  const workProjects = renderProjects(projects);
  const validateEnd = untilNow ? DATE_NOW : validateDate(endTime);
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
          {validateDate(startTime)}  ~  {validateEnd}
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
    school,
    major,
    education,
    startTime,
    endTime,
    index
  } = options;
  return (
    <div className={styles.row} key={index}>
      <div className={cx(styles.rowLeft, styles.textRight)}>
        <span className={styles.mainText}>{school}</span><br />
        <span className={styles.subText}>
          {validateDate(startTime)}  ~  {validateDate(endTime)}
        </span>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.mainText}>{major}</span><br />
        <span className={styles.subText}>{education}</span>
      </div>
    </div>
  );
};

class ResumeComponentV2 extends React.PureComponent {
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

  renderEdu() {
    const { educations } = this.props.resume;
    const edus = educations
      .filter(edu => edu.school)
      .sort(sortByDate)
      .reverse()
      .map((edu, index) => renderEduRow({
        ...edu,
        index
      }));

    return section({
      title: '教育经历',
      rows: edus,
      className: styles.firstSection
    });
  }

  renderWorkExperience() {
    const { workExperiences } = this.props.resume;
    const exps = workExperiences
      .filter(experience => experience.company)
      .sort(sortByDate)
      .reverse()
      .map((experience, index) => renderWorkExperienceRow({
        ...experience,
        index
      }));

    return section({
      title: '工作经历',
      rows: exps
    });
  }

  renderPersonalProjects() {
    const { personalProjects } = this.props.resume;

    const projects = personalProjects
      .filter(project => project.title)
      .map((project, index) => renderPersonalProjectsRow({
        ...project,
        index
      }));

    return section({
      title: '个人项目',
      rows: projects
    });
  }

  renderSupplements() {
    const { others } = this.props.resume;
    const { supplements } = others;
    if (!supplements.length) { return null; }

    const personalSupplements = supplements.map((supplement, index) => {
      return (
        <li key={index}>
          {supplement}
        </li>
      );
    });

    return (
      <div className={styles.sectionColumn}>
        <span className={styles.subText}>自我评价</span>
        <ul className={styles.list}>
          {personalSupplements}
        </ul>
      </div>
    );
  }

  renderLinks() {
    const { others } = this.props.resume;
    const { socialLinks } = others;
    if (!socialLinks.length) { return null; }

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
      } else {
        return null;
      }
    }).filter(item => item);
    if (!socials.length) { return null; }

    return (
      <div className={styles.sectionColumn}>
        <span className={styles.subText}>其他链接</span>
        <ul className={styles.list}>
          {socials}
        </ul>
      </div>
    );
  }

  renderSupplementsAndLinks() {
    const supplements = this.renderSupplements();
    const otherLinks = this.renderLinks();
    let titles = [];
    if (!supplements && !otherLinks) return null;
    if (supplements) titles.push('自我评价');
    if (otherLinks) titles.push('其他链接');
    return section({
      title: titles.join('与'),
      rows: (
        <div className={styles.row}>
          {supplements}
          {otherLinks}
        </div>
      )
    });
  }

  render() {
    const { showGithub } = this.state;
    const { resume, shareInfo, login } = this.props;
    const { info, others, updateAt } = resume;
    const { useGithub, github, githubUrl } = shareInfo;

    if (useGithub && showGithub) {
      return (
        <div className={styles.container}>
          <div
            className={cx(
              styles["github_wrapper"],
              showGithub && styles["github_wrapper_active"]
            )}>
            <a
              onClick={() => this.changeShowGithub(false)}
              className={cx(
                styles.baseLink,
                styles.baseInfo,
                styles.githubBack
              )}
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
              返回
            </a>
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
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.name}>{info.name}</div>
            <div className={styles.contact}>
              {renderBaseInfo({
                url: info.phone,
                value: info.phone,
                icon: 'mobile',
                type: 'mobile',
              })}
              {renderBaseInfo({
                url: info.email,
                value: info.email,
                icon: 'envelope-o',
                type: 'email',
              })}
            </div>
            <div className={styles.info}>
              {renderBaseInfo({
                value: info.location,
              })}
              {renderBaseInfo({
                value: info.intention,
              })}
              {
                useGithub ? (
                  githubUrl ? renderBaseInfo({
                    url: githubUrl,
                    icon: 'github',
                    value: '查看我的 GitHub 总结报告'
                  }) : (
                    <a
                      onClick={() => this.changeShowGithub(true)}
                      className={cx(
                        styles.baseLink,
                        styles.baseInfo
                      )}
                    >
                      <i className="fa fa-github" aria-hidden="true"></i>
                      查看我的 GitHub 总结报告
                    </a>
                  )
                ) : ''
              }
            </div>
          </div>
          {this.renderEdu()}
          {this.renderWorkExperience()}
          {this.renderPersonalProjects()}
          {this.renderSupplementsAndLinks()}
        </div>
        <div className={styles.footer}>
          {others.dream}
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
