import React, { PropTypes } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';

import dateHelper from 'UTILS/date';
import { sortByX } from 'UTILS/helper';
import validator from 'UTILS/validator';
import styles from '../../styles/resume_modal.css';

const sortByDate = sortByX('startTime');
const validateDate = dateHelper.validator.date;

class ResumeModal extends React.Component {
  renderEducations() {
    const { educations } = this.props.resume;
    if (!educations.length) { return }
    const edus = educations.sort(sortByDate).map((edu, index) => {
      const { school, major, education, startTime, endTime} = edu;
      if (!school) { return }
      return (
        <div key={index} className={styles["resume_section_wrapper"]}>
          <div className={styles["resume_info_header"]}>{school}{education ? `, ${education}` : ''}</div>
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div className={styles["info_text"]}>{major}</div>
          <div className={styles["section_dot"]}></div>
        </div>
      )
    });

    return (
      <div className={styles["resume_info_wrapper"]}>
        <div className={styles["info_title"]}>
          <i className="fa fa-university" aria-hidden="true"></i>教育经历
        </div><br/>
      <div className={cx(styles["info_wrapper"], styles["multi_info"])}>
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
        <div key={index} className={styles["resume_section_wrapper"]}>
          {validator.url(url) ? (
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["resume_info_header"], styles["header_link"])}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {company}
            </a>
          ) : (<div className={styles["resume_info_header"]}>{company}</div>)}
          {position ? `, ${position}` : ''}
          <div className={styles["info_text"]}>{validateDate(startTime)}  ~  {validateDate(endTime)}</div>
          <div>{workProjects}</div>
          <div className={styles["section_dot"]}></div>
        </div>
      )
    });

    return (
      <div className={styles["resume_info_wrapper"]}>
        <div className={styles["info_title"]}>
          <i className="fa fa-file-text-o" aria-hidden="true"></i>工作经历
        </div><br/>
      <div className={cx(styles["info_wrapper"], styles["multi_info"])}>
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
            - {detail}
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
            <a target="_blank" href={url[0] === 'h' ? url : `//${url}`} className={cx(styles["resume_info_header"], styles["header_link"])}>
              <i className="fa fa-link" aria-hidden="true"></i>&nbsp;&nbsp;
              {title}
            </a>
          ) : (<div className={styles["resume_info_header"]}>{title}</div>)}
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
      <div className={styles["resume_info_wrapper"]}>
        <div className={styles["info_title"]}>
          <i className="fa fa-code" aria-hidden="true"></i>个人项目
        </div><br/>
        <div className={cx(styles["info_wrapper"], styles["base_info"])}>
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
          - {supplement}
        </li>
      )
    });

    return (
      <div className={styles["resume_info_wrapper"]}>
        <div className={styles["info_title"]}>
          <i className="fa fa-quote-left" aria-hidden="true"></i>自我评价
        </div><br/>
        <div className={cx(styles["info_wrapper"], styles["base_info"])}>
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
    })

    return (
      <div className={styles["resume_info_wrapper"]}>
        <div className={styles["info_title"]}>
          <i className="fa fa-link" aria-hidden="true"></i>其他链接
        </div><br/>
        <div className={cx(styles["info_wrapper"], styles["base_info"])}>
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
      educations,
      workExperiences,
      personalProjects,
      others
    } = resume;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles["resume_modal_container"]}>
          <div className={styles["resume_modal_wrapper"]}>
            <div className={styles["resume_info_wrapper"]}>
              <div className={styles["info_title"]}>
                <i className="fa fa-vcard-o" aria-hidden="true"></i>基本信息
              </div>
              <br/>
              <div className={cx(styles["info_wrapper"], styles["base_info"])}>
                <div className={styles["resume_info_header"]}>
                  {info.name}
                  &nbsp;&nbsp;&nbsp;
                  <i className={`fa fa-${info.gender}`} aria-hidden="true"></i>
                </div><br/>
                <div className={styles["info_text"]}>
                  <i className="fa fa-map-marker" aria-hidden="true"></i>
                  &nbsp;&nbsp;{info.location}&nbsp;&nbsp;&nbsp;
                  {info.intention}
                </div>
                <div className={styles["info_text"]}>
                  <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;&nbsp;{info.email}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <i className="fa fa-mobile" aria-hidden="true"></i>&nbsp;&nbsp;{info.phone}
                </div>
                {others.dream ? (
                  <div className={styles["info_text"]}>
                    <i className="fa fa-quote-left" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
                    {others.dream}
                  </div>
                ) : ''}
              </div>
            </div>
            {this.renderEducations()}
            {this.renderWorkExperiences()}
            {this.renderPersonalProjects()}
            {this.renderSupplements()}
            {this.renderSocialLinks()}
          </div>
          { openModal ? <TipsoModal text="按 ESC 即可退出预览"/> : ''}
        </div>
      </PortalModal>
    )
  }
}

ResumeModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func
};

ResumeModal.defaultProps = {
  openModal: false,
  onClose: () => {}
};

function mapStateToProps(state) {
  return {
    resume: state.resume
  }
}

export default connect(mapStateToProps)(ResumeModal);
