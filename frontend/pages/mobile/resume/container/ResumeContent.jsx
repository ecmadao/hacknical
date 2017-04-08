import React from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';
import Api from 'API/index';
import dateHelper from 'UTILS/date';
import locales from 'LOCALES';
import Slick from '../../shared/components/Slick';
import styles from '../styles/resume.css';
import { sortBySeconds } from 'UTILS/helper';

const sortByDate = sortBySeconds('startTime');
const sortByEndDate = sortBySeconds('endTime');
const validateDate = dateHelper.validator.date;
const getSecondsByDate = dateHelper.seconds.getByDate;

const LINK_OPTIONS = {
  text: '',
  url: '',
  showIcon: true,
  icon: null,
  className: ''
};
const LinkInfo = (options = LINK_OPTIONS) => {
  const { text, url, showIcon, icon, className } = objectAssign({}, LINK_OPTIONS, options);
  return (
    <a target="_blank" href={url} className={cx(styles.linkText, className)}>
      {showIcon ? (
        icon ? (
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        ) : (
          <i className="fa fa-link" aria-hidden="true"></i>
        )
      ) : ''}
      {text}
    </a>
  );
};

class ResumeContent extends React.Component {

  renderHeader() {
    const { info, others } = this.props.resume;
    const { email, phone, name } = info;
    const { dream } = others;

    return (
      <div className={styles['section-header']}>
        <div className={styles.maxText}>{name}</div>
        {phone ? LinkInfo({
          text: phone,
          url: `tel:${phone}`,
          icon: 'mobile'
        }) : ''}
        {email ? LinkInfo({
          text: email,
          url: `mailto:${email}`,
          icon: 'envelope-o'
        }) : ''}
        {dream ? (
          <div className={styles.sideText}>{dream}</div>
        ) : ''}
      </div>
    )
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
          <div className={styles['section-row']}>
            <div className={styles['row-left']}>
              {validateDate(startTime)}<br/>~<br/>{validateDate(endTime)}
            </div>
            <div className={styles['row-right']}>
              <div className={styles.mainText}>{school}</div>
              <div className={styles.sideText}>{education}</div>
              {major ? (<div className={styles.sideText}>{major}</div>) : ''}
            </div>
          </div>
        )
      });

    if (!edus.length) { return }

    return (
      <div className={styles['resume-section']}>
        <div className={styles['section-body']}>
          {edus}
        </div>
      </div>
    )
  }

  renderWorkExperiences() {
    const { workExperiences } = this.props.resume;

    const exps = workExperiences
      .filter(experience => experience.company)
      .sort(sortByDate)
      .reverse()
      .map((experience, index) => {
        const { company, url, startTime, endTime, position, projects } = experience;
        const workProjects = this.renderWorkProjects(projects);
        return (
          <div className={styles['section-row']}>
            <div className={styles['row-left']}>
              {validateDate(startTime)}<br/>~<br/>{validateDate(endTime)}
            </div>
            <div className={cx(styles['row-right'], styles['right-container'])}>
              <div className={styles['right-header']}>
                <div className={styles.mainText}>{company}</div>
                {position ? (<div className={styles.sideText}>{position}</div>) : ''}
              </div>
              <div className={styles['section-projects']}>
                {workProjects}
              </div>
            </div>
          </div>
        );
      });

    if (!exps.length) { return }

    return (
      <div className={styles['resume-section']}>
        <div className={styles['section-body']}>
          {exps}
        </div>
      </div>
    )
  }

  renderWorkProjects(projects) {
    return projects
      .filter(project => project.name)
      .map((project, index) => {
        const { name, url, details } = project;
        const projectDetails = details.map((detail, i) => {
          return (
            <li key={i}>
              {detail}
            </li>
          );
        });
        return (
          <div key={index} className={styles['section-project']}>
            <div className={styles['project-header']}>{name}</div>
            <ul className={styles['project-list']}>
              {projectDetails}
            </ul>
          </div>
        )
      });
  }

  renderPersonalProjects() {

  }

  renderSupplements() {

  }

  renderSocialLinks() {

  }

  renderSlick() {
    const { loading, resume } = this.props;
    if (loading) { return }
    const { info, others } = resume;
    const { intention, location, gender } = info;
    const { expectLocation } = others;
    const sliders = [];
    if (intention) {
      sliders.push({
        mainText: intention,
        subText: '期望职位'
      });
    }
    if (location) {
      sliders.push({
        mainText: location,
        subText: '所在城市'
      });
    }
    if (expectLocation) {
      sliders.push({
        mainText: expectLocation,
        subText: '期望工作地点'
      });
    }
    if (gender) {
      sliders.push({
        mainText: gender,
        subText: '性别'
      });
    }

    return (
      <Slick sliders={sliders} className={styles['slider_wrapper']}/>
    );
  }

  render() {
    return (
      <div>
        <div className={cx(styles.section, styles['header-section'])}>
          {this.renderHeader()}
          {this.renderSlick()}
        </div>
        <div className={styles.section}>
          {this.renderEducations()}
          {this.renderWorkExperiences()}
        </div>
      </div>
    )
  }
}

export default ResumeContent;
