import React, { PropTypes } from 'react';
import Portal from 'react-portal';
import BaseModal from 'COMPONENTS/BaseModal';

class PortalModal extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   const { showModal } = this.props;
  //   return nextProps.showModal !== showModal;
  // }

  render() {
    const { closeOnEsc, showModal, onClose, closeOnOutsideClick, children } = this.props;
    return (
      <Portal
        closeOnEsc={closeOnEsc}
        isOpened={showModal}
        onClose={onClose}
        closeOnOutsideClick={closeOnOutsideClick}>
        <BaseModal showModal={true} onClose={onClose}>
          {children}
        </BaseModal>
      </Portal>
    )
  }
}

PortalModal.propTypes = {
  closeOnEsc: PropTypes.bool,
  showModal: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

PortalModal.defaultProps = {
  closeOnEsc: true,
  showModal: false,
  closeOnOutsideClick: false,
  onClose: () => {},
  children: (<div></div>)
};

export default PortalModal;
