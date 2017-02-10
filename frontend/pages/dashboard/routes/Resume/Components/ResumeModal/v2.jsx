import React, { PropTypes } from 'react';

import Api from 'API';
import FloatingActionButton from 'COMPONENTS/FloatingActionButton';
import PortalModal from 'COMPONENTS/PortalModal';
import TipsoModal from 'COMPONENTS/TipsoModal';
import ResumeComponent from 'SHAREDPAGE/components/ResumeComponent';
import ResumeDownloader from 'SHAREDPAGE/components/ResumeDownloader';
import ShareModal from 'SHAREDPAGE/components/ShareModal';

import { GREEN_COLORS } from 'UTILS/colors';
import styles from '../../styles/resume_modal_v2.css';

class ResumeModalV2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      openShare: false,
      openShareModal: false
    };
    this.changeShareStatus = this.changeShareStatus.bind(this);
    this.toggleShareModal = this.toggleShareModal.bind(this);
  }

  componentDidMount() {
    Api.resume.getPubResumeStatus().then((result) => {
      console.log('getPubResumeStatus');
      console.log(result);
      const { openShare, url } = result;
      this.setState({
        url,
        openShare
      });
    });
  }

  toggleShareModal(openShareModal) {
    this.setState({ openShareModal });
  }

  changeShareStatus() {
    const { openShare } = this.state;
    Api.resume.postPubResumeStatus(!openShare).then(() => {
      this.setState({ openShare: !openShare });
    });
  }

  render() {
    const { openShareModal, openShare, url } = this.state;
    const { onClose, openModal, resume } = this.props;
    const origin = window.location.origin;

    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles["modal_container"]}>
          <ResumeComponent resume={resume} />
          { openModal ? <TipsoModal text="按 ESC 即可退出预览"/> : ''}
          <FloatingActionButton
            icon="share-alt"
            style={{
              right: '15%',
              bottom: '100px',
              backgroundColor: GREEN_COLORS[1]
            }}
            onClick={() => this.toggleShareModal(true)}
          />
          <ResumeDownloader resume={resume} />
          {openShareModal ? (
            <ShareModal
              openModal={openShareModal}
              options={{
                openShare,
                link: `${origin}/${url}`,
                text: '分享你的个人简历'
              }}
              toggleShare={this.changeShareStatus}
              onClose={() => this.toggleShareModal(false)}
            />
          ) : ''}
        </div>
      </PortalModal>
    )
  }
}

ResumeModalV2.propTypes = {
  openModal: PropTypes.bool,
  openShareModal: PropTypes.bool,
  onClose: PropTypes.func,
  resume: PropTypes.object
};

ResumeModalV2.defaultProps = {
  openModal: false,
  openShareModal: false,
  onClose: () => {},
  resume: {}
};

export default ResumeModalV2;
