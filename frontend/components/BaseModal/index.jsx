import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './base_modal.css';

class BaseModal extends React.Component {
  onClose() {
    const {onClose} = this.props;
    onClose && onClose();
  }

  render() {
    const { children, showModal, className } = this.props;
    const modalClass = cx(
      styles["modal_component"],
      showModal && styles["active"],
      className
    );
    return (
      <div className={modalClass}>
        <div className={styles["modal_wrapper"]} onClick={this.onClose.bind(this)}></div>
        {children}
      </div>
    )
  }
}

BaseModal.propTypes = {
  showModal: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

BaseModal.defaultProps = {
  showModal: true,
  onClose: () => {},
  className: '',
  children: (<div></div>)
};

export default BaseModal;
