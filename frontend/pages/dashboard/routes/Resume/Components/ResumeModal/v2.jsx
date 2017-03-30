import React, { PropTypes } from 'react';
import { ShortMessage, FloatingActionButton, PortalModal } from 'light-ui';
import ResumeComponent from 'SHARED/components/ResumeComponent';
import styles from '../../styles/resume_modal_v2.css';

const ResumeModalV2 = (props) => {
  const {
    onClose,
    onShare,
    onDownload,
    openModal,
    resume,
    shareInfo
  } = props;

  return (
    <PortalModal
      showModal={openModal}
      onClose={onClose}>
      <div className={styles["modal_container"]}>
        <ResumeComponent
          resume={resume}
          shareInfo={shareInfo}
        />
        { openModal ? <ShortMessage text="按 ESC 即可退出预览"/> : ''}
        <FloatingActionButton
          icon="share-alt"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '15%',
            zIndex: '11'
          }}
          color="green"
          onClick={onShare}
        />
        <FloatingActionButton
          icon="download"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '15%',
            zIndex: '11'
          }}
          color="green"
          onClick={onDownload}
        />
      </div>
    </PortalModal>
  )
};

ResumeModalV2.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  onShare: PropTypes.func,
  onDownload: PropTypes.func,
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
};

ResumeModalV2.defaultProps = {
  openModal: false,
  onClose: () => {},
  onShare: () => {},
  onDownload: () => {},
  resume: {},
  shareInfo: {},
};

export default ResumeModalV2;
