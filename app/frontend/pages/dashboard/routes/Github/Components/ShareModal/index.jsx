import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PortalModal from 'COMPONENTS/PortalModal';
import github from 'UTILS/github';

import UserInfo from './UserInfo';
import '../../styles/share_modal.css';

class ShareModal extends React.Component {
  render() {
    const { openModal, onClose, user } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="share_modal_container">
          <UserInfo user={user} />
        </div>
      </PortalModal>
    )
  }
}

function mapStateToProps(state) {
  const {
    user,
    repos,
    reposLanguages
  } = state.github;
  return {
    user,
    repos,
    reposLanguages
  };
}

export default connect(mapStateToProps)(ShareModal);
