import React, { PropTypes } from 'react';
import { ShortMessage, FloatingActionButton, PortalModal } from 'light-ui';
import ResumeComponent from 'SHAREDPAGE/components/ResumeComponent';
import ResumeDownloader from 'SHAREDPAGE/components/ResumeDownloader';
import styles from '../../styles/resume_modal_v2.css';

class ResumeModalV2 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onClose,
      onShare,
      openModal,
      resume,
      shareInfo
    } = this.props;

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
              right: '15%'
            }}
            color="green"
            onClick={onShare}
          />
          {/* <ResumeDownloader
            resume={resume}
            style={{
              right: '12%'
            }}
          /> */}
        </div>
      </PortalModal>
    )
  }
}

ResumeModalV2.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  onShare: PropTypes.func,
  resume: PropTypes.object,
  shareInfo: PropTypes.object,
};

ResumeModalV2.defaultProps = {
  openModal: false,
  onClose: () => {},
  onShare: () => {},
  resume: {},
  shareInfo: {},
};

export default ResumeModalV2;
