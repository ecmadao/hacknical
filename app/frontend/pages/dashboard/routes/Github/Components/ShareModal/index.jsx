import React, { PropTypes } from 'react';
import PortalModal from 'COMPONENTS/PortalModal';
import github from 'UTILS/github';

import '../../styles/share_modal.css';

class ShareModal extends React.Component {
  render() {
    const { openModal, onClose } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="share_modal_container"></div>
      </PortalModal>
    )
  }
}

ShareModal.propTypes = {
  openModal: PropTypes.bool,
  repos: PropTypes.array,
  onClose: PropTypes.func,
};

ShareModal.defaultProps = {
  openModal: false,
  repos: [],
  onClose: () => {},
};

export default ShareModal;
