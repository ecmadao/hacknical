import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import PortalModal from 'COMPONENTS/PortalModal';
import github from 'UTILS/github';
import {
  sortRepos
} from 'UTILS/helper';

import UserInfo from './UserInfo';
import ReposInfo from './ReposInfo';
import '../../styles/share_modal.css';

class ShareModal extends React.Component {
  render() {
    const {
      user,
      repos,
      onClose,
      openModal,
      commitDatas
    } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="share_modal_container">
          <UserInfo user={user} />
          <ReposInfo repos={repos} commits={commitDatas} />
        </div>
      </PortalModal>
    )
  }
}

function mapStateToProps(state) {
  const {
    user,
    repos,
    commitDatas,
    reposLanguages
  } = state.github;
  return {
    user,
    reposLanguages,
    commitDatas,
    repos: repos.sort(sortRepos()),
  };
}

export default connect(mapStateToProps)(ShareModal);
