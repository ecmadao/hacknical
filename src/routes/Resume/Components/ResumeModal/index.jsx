import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';

import { sortByX } from 'UTILS/date';
const sortByDate = sortByX('startTime');

import '../../styles/resume_modal.css';

class ResumeModal extends React.Component {
  renderEdus() {

  }

  renderWEs() {

  }

  renderPPs() {

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
        <div className="resume_modal_container">
          <div className="resume_modal_wrapper">
            <div className="resume_info_wrapper">
              <div className="info_title">
                基本信息
              </div>
              <br/>
              <div className="info_wrapper">
                <div className="info_header">
                  {info.name}
                  &nbsp;&nbsp;&nbsp;
                  <i className={`fa fa-${info.gender}`} aria-hidden="true"></i>
                </div><br/>
                <div className="info_text">
                  求职意向：{info.intention}&nbsp;&nbsp;&nbsp;
                  <i className="fa fa-map-marker" aria-hidden="true"></i>&nbsp;&nbsp;{info.location}
                </div>
                <div className="info_text">
                  <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;&nbsp;{info.email}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <i className="fa fa-mobile" aria-hidden="true"></i>&nbsp;&nbsp;{info.phone}
                </div>
                <div className="info_text">
                  <i className="fa fa-quote-left" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
                  {others.dream}
                </div>
              </div>
            </div>
            <div className="resume_info_wrapper">
              <div className="info_title">
                教育经历
              </div>
              <div className="info_wrapper"></div>
            </div>
            <div className="resume_info_wrapper">
              <div className="info_title">
                工作经历
              </div>
              <div className="info_wrapper"></div>
            </div>
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
