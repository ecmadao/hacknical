import React from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';
import { Loading } from 'light-ui';
import dateHelper from 'UTILS/date';
import validator from 'UTILS/validator';
import Slick from '../../shared/components/Slick';
import styles from '../styles/resume.css';
import { sortBySeconds } from 'UTILS/helper';
import { GENDERS } from 'SHARED/datas/resume';
import locales from 'LOCALES';

const sortByDate = sortBySeconds('startTime');
const validateDate = dateHelper.validator.date;
const { hoursBefore } = dateHelper.relative;
const { hasUrl } = validator;
const resumeTexts = locales("resume");

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
          icon: 'mobile',
          showIcon: false,
          className: styles.phone
        }) : ''}
        {email ? LinkInfo({
          text: email,
          url: `mailto:${email}`,
          showIcon: false,
          icon: 'envelope-o'
        }) : ''}
        {dream ? (
          <div className={styles.minText}>{dream}</div>
        ) : ''}
      </div>
    );
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
          <div className={styles['section-row']} key={index}>
            <div className={styles['row-left']}>
              {validateDate(startTime)}<br/>~<br/>{validateDate(endTime)}
            </div>
            <div className={styles['row-right']}>
              <div className={styles.mainText}>{school}</div>
              <div className={styles.sideText}>{education}</div>
              {major ? (<div className={styles.sideText}>{major}</div>) : ''}
            </div>
          </div>
        );
      });

    if (!edus.length) { return; }

    return (
      <div className={styles['resume-section']}>
        {edus}
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
        const workProjects = this.renderWorkProjects(projects);
        return (
          <div className={styles['section-row']} key={index}>
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

    if (!exps.length) { return; }

    return (
      <div className={styles['resume-section']}>
        {exps}
      </div>
    );
  }

  renderWorkProjects(projects) {
    return projects
      .filter(project => project.name)
      .map((project, index) => {
        const { name, url, details } = project;
        const projectDetails = details.map((detail, i) => {
          return (
            <li
              key={i}
              className={cx(
                hasUrl(detail) && styles['section-withlink']
              )}
            >
              {detail}
            </li>
          );
        });
        return (
          <div key={index} className={styles['section-project']}>
            <div className={styles['project-header']}>{name}</div>
            <ul className={styles['section-list']}>
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
        const { url, desc, title } = project;
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
            ) : ''}
          </div>
        );
      });

    if (!projects.length) { return; }

    return (
      <div className={styles['resume-section']}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            个人项目
          </div>
          <div className={cx(styles['row-right'], styles['right-container'])}>
            {projects}
          </div>
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
        <li
          key={index}
          className={cx(
            hasUrl(supplement) && styles['section-withlink']
          )}
        >
          {supplement}
        </li>
      );
    });

    return (
      <div className={styles['resume-section']}>
        <div className={styles['section-row']}>
          <div className={styles['row-left']}>
            自我评价
          </div>
          <div className={styles['row-right']}>
            <ul className={cx(styles['section-list'], styles.sideText)}>
              {personalSupplements}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  renderSlick() {
    const { loading, resume } = this.props;
    if (loading) { return; }
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
      const targetGender = GENDERS.filter(item => item.id === gender)[0];
      if (targetGender) {
        sliders.push({
          mainText: targetGender.value,
          subText: '性别'
        });
      }
    }
    return (<Slick sliders={sliders} className={styles.slick}/>);
  }

  render() {
    const { resume } = this.props;
    const { updateAt } = resume;

    return (
      <div className={styles['resume-container']}>
        {this.props.loading ? (<Loading loading={true} />) : ''}
        <div className={styles['header-section']}>
          {this.renderHeader()}
          {this.renderSlick()}
        </div>
        {this.renderEducations()}
        {this.renderWorkExperiences()}
        {this.renderPersonalProjects()}
        {this.renderSupplements()}
        {updateAt ? (
          <div className={styles.resumeTip}>
            {resumeTexts.updateAt}{hoursBefore(updateAt)}
          </div>
        ) : ''}
      </div>
    );
  }
}

export default ResumeContent;
