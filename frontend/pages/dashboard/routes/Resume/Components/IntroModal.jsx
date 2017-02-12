import React, { PropTypes } from 'react';

import PortalModal from 'COMPONENTS/PortalModal';
import styles from '../styles/intro_modal.css';

class IntroModal extends React.Component {
  render() {
    const { openModal, onClose, datas } = this.props;

    const intros = datas.map((data, index) => {
      return (<li key={index}>{data}</li>);
    });
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles.container}>
          <div className={styles.header}>使用说明</div>
          <ul className={styles.content}>
            {intros}
          </ul>
        </div>
      </PortalModal>
    )
  }
}

IntroModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  datas: PropTypes.array
};

IntroModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  datas: []
};

export default IntroModal;
