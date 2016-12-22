import React, { PropTypes } from 'react';
import PortalModal from 'COMPONENTS/PortalModal';
import ReposItem from './ReposItem';
import '../../styles/repos_modal.css';

class ReposModal extends React.Component {
  constructor(props) {
    super(props);
    const { selectedItems } = this.props;
    this.state = {
      selectedItems
    };
  }

  renderRepos() {
    const { items } = this.props;
    return items.map((item, index) => {
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
          <div className="repos_modal_header"></div>
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
  items: PropTypes.array,
};

ReposModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  onSave: () => {},
  selectedItems: [],
  items: []
};

export default ReposModal;
