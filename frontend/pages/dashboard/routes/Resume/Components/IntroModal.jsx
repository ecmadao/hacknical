import React, { PropTypes } from 'react';

import PortalModal from 'COMPONENTS/PortalModal';
import styles from '../styles/intro_modal.css';

class IntroModal extends React.Component {
  render() {
    const { openModal, onClose, intros, tips } = this.props;

    const intro = intros.map((data, index) => {
      return (<li key={index}>{data}</li>);
    });
    const tip = tips.map((tip, index) => {
      return (<li key={index}>{tip}</li>);
    });
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className={styles.container}>
          <div className={styles['container-wrapper']}>
            <div className={styles.header}>使用说明</div>
            <ul className={styles.content}>
              {intro}
            </ul>
          </div>
          <div className={styles['container-wrapper']}>
            <div className={styles.header}>小建议</div>
            <ul className={styles.content}>
              {tip}
            </ul>
          </div>
        </div>
      </PortalModal>
    )
  }
}

IntroModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  intros: PropTypes.array,
  tips: PropTypes.array,
};

IntroModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  intros: [],
  tips: [],
};

export default IntroModal;
