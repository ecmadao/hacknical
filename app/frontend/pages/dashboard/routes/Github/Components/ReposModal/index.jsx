import React, { PropTypes } from 'react';
import PortalModal from 'COMPONENTS/PortalModal';
import Selector from 'COMPONENTS/Selector';
import ReposItem from './ReposItem';
import '../../styles/repos_modal.css';
import {
  getReposByLanguage
} from '../../helper/repos';

class ReposModal extends React.Component {
  constructor(props) {
    super(props);
    const { selectedItems } = this.props;
    this.state = {
      selectedItems
    };
  }

  renderRepos() {
    const { repos } = this.props;
    return repos.map((item, index) => {
      return (
        <ReposItem key={index} />
      )
    });
  }

  render() {
    const { openModal, onClose } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="repos_modal_container">
          <div className="repos_modal_header">
            已选择的仓库
          </div>
          <div className="repos_modal_contents">
            {this.renderRepos()}
          </div>
        </div>
      </PortalModal>
    )
  }
}

ReposModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  selectedItems: PropTypes.array,
  repos: PropTypes.array,
  languages: PropTypes.array
};

ReposModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  onSave: () => {},
  selectedItems: [],
  repos: [],
  languages: []
};

export default ReposModal;
