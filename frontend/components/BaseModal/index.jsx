import React, { PropTypes } from 'react';
import cx from 'classnames';
import styles from './base_modal.css';

class BaseModal extends React.Component {
  onClose() {
    const {onClose} = this.props;
    onClose && onClose();
  }

  render() {
    const { children, showModal } = this.props;
    const modalClass = cx(
      styles["modal_component"],
      showModal && styles["active"]
    );
    return (
      <div className={modalClass}>
        <div className={styles["modal_wrapper"]} onClick={this.onClose.bind(this)}></div>
        <div className={styles["modal_container"]}>
          {children}
        </div>
      </div>
    )
  }
}

BaseModal.propTypes = {
  showModal: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
};

BaseModal.defaultProps = {
  showModal: true,
  onClose: () => {},
  children: (<div></div>)
};

export default BaseModal;
