import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';

import dateHelper from 'UTILS/date';
import { sortByX } from 'UTILS/helper';
import validator from 'UTILS/validator';
import styles from '../../styles/resume_modal_v2.css';

const sortByDate = sortByX('startTime');
const validateDate = dateHelper.validator.date;

const baseInfo = (text, icon, style = '') => {
  return (
    <div className={cx(styles["base_info"], style)}>
      <i className={cx(`fa fa-${icon}`, styles["base_icon"])} aria-hidden="true"></i>
      &nbsp;&nbsp;
      {text}
    </div>
  )
};

const titleInfo = (text, icon, style = '') => {
  return (
    <div className={cx(styles["title_info"], style)}>
      <i className={cx(`fa fa-${icon}`, styles["title_icon"])} aria-hidden="true"></i>
      &nbsp;&nbsp;&nbsp;
      {text}
    </div>
  )
};

class ResumeModalV2 extends React.Component {
  renderEducations() {
    const { educations } = this.props.resume;
    if (!educations.length) { return }

    const edus = educations.sort(sortByDate).map((edu, index) => {
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

    const exps = workExperiences.map((experience, index) => {
      const { company, url, startTime, endTime, position, projects } = experience;
      if (!company) { return }
      const workProjects = this.renderProjects(projects);
      return (
        <div key={index} className={styles["section_wrapper"]}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles["header_link"])}>
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
      })
      return (
        <div key={index}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["info_header"], styles["header_link"])}>
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
            {text || name}
            &nbsp;:&nbsp;&nbsp;&nbsp;
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`}>{url}</a>
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
    const { onClose, openModal, resume } = this.props;
    const {
      info,
      others
    } = resume;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles["modal_container"]}>
          <div className={styles["modal_wrapper"]}>
            <div className={styles["modal_left"]}>
              {this.renderEducations()}
              {this.renderWorkExperiences()}
              {this.renderPersonalProjects()}
              {this.renderSupplements()}
              {this.renderSocialLinks()}
            </div>
            <div className={styles["modal_right"]}>
              {baseInfo(info.name, info.gender, styles["user_title"])}<br/>
              {baseInfo(info.phone, 'mobile')}
              {baseInfo(info.email, 'envelope-o')}
              {baseInfo(`${info.location}  ${info.intention}`, 'map-marker')}
              {others.dream ? (
                <div className={styles["user_dream"]}>
                  {baseInfo(others.dream, 'quote-left')}
                </div>
              ) : ''}
            </div>
          </div>
          { openModal ? <TipsoModal text="按 ESC 即可退出预览"/> : ''}
        </div>
      </PortalModal>
    )
  }
}

ResumeModalV2.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func
};

ResumeModalV2.defaultProps = {
  openModal: false,
  onClose: () => {}
};

function mapStateToProps(state) {
  return {
    resume: state.resume
  }
}

export default connect(mapStateToProps)(ResumeModalV2);
