import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';

import '../../styles/resume_modal.css';

class ResumeModal extends React.Component {
  render() {
    const { onClose, openModal } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="resume_modal_container">
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

export default connect()(ResumeModal);
