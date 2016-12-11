import React, { PropTypes } from 'react';
import cx from 'classnames';
import './base_modal.css';

class BaseModal extends React.Component {
  onClose() {
    const {onClose} = this.props;
    onClose && onClose();
  }

  render() {
    const { children, showModal } = this.props;
    const modalClass = cx(
      'modal_component',
      showModal && 'active'
    );
    // const modalClass = showModal ? styles['modal-component-active'] : styles['modal-component'];
    return (
      <div className={modalClass}>
        <div className="modal_wrapper" onClick={this.onClose.bind(this)}></div>
        <div className="modal_container">
          {children}
        </div>
      </div>
    )
  }
}

BaseModal.propTypes = {
  showModal: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.element
};

BaseModal.defaultProps = {
  showModal: true,
  onClose: () => {},
  children: (<div></div>)
};

export default BaseModal;
