import React, { PropTypes } from 'react';
import cx from 'classnames';
import { ShortMessage, FloatingActionButton, PortalModal } from 'light-ui';
import styles from '../../styles/template_modal.css';
import modalStyles from '../../styles/modal.css';

const TemplateModal = (props) => {
  const {
    onClose,
    openModal,
    template,
    onTemplateChange
  } = props;

  return (
    <PortalModal
      showModal={openModal}
      onClose={onClose}
    >
      <div className={cx(
          modalStyles.modalContainer,
          modalStyles.modalSmall,
        )}>
        <div className={styles.modalWrapper}>
          <div className={styles.modalSection}>
            <div
              className={cx(
                styles.template,
                styles.templatev1,
                template === 'v1' && styles.templateActive
              )}
              onClick={() => onTemplateChange('v1')}
            />
          </div>
          <div className={styles.modalSection}>
            <div
              className={cx(
                styles.template,
                styles.templatev2,
                template === 'v2' && styles.templateActive
              )}
              onClick={() => onTemplateChange('v2')}
            />
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default TemplateModal;
