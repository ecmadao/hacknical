import React, { PropTypes } from 'react';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';
import ResumeComponent from 'SHAREDPAGE/ResumeComponent';
import styles from '../../styles/resume_modal_v2.css';

class ResumeModalV2 extends React.Component {

  render() {
    const { onClose, openModal, resume } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles["modal_container"]}>
          <ResumeComponent resume={resume} />
          { openModal ? <TipsoModal text="按 ESC 即可退出预览"/> : ''}
        </div>
      </PortalModal>
    )
  }
}

ResumeModalV2.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  resume: PropTypes.object
};

ResumeModalV2.defaultProps = {
  openModal: false,
  onClose: () => {},
  resume: {}
};

export default ResumeModalV2;
