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

class ResumeModalV2 extends React.Component {
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
        <div className={styles["modal_container"]}>
          <div className={styles["modal_wrapper"]}>
            <div className={styles["modal_left"]}>

            </div>
            <div className={styles["modal_right"]}>
              {baseInfo(info.name, info.gender, styles["user_title"])}
              {baseInfo(info.phone, 'mobile')}
              {baseInfo(info.email, 'envelope-o')}
              {baseInfo(`${info.location}  ${info.intention}`, 'map-marker')}
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
