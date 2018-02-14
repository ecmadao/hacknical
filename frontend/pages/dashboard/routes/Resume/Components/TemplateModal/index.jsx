import React from 'react';
import cx from 'classnames';
import { PortalModal } from 'light-ui';
import styles from '../../styles/template_modal.css';
import modalStyles from '../../styles/modal.css';

const TemplateModal = (props) => {
  const {
    onClose,
    template,
    openModal,
    onTemplateChange
  } = props;

  return (
    <PortalModal
      showModal={openModal}
      onClose={onClose}
    >
      <div
        className={cx(
          modalStyles.modalContainer,
          modalStyles.modalSmall,
        )}
      >
        <div className={styles.header}>
          简历模板选择
        </div>
        <div className={styles.modalWrapper}>
          <div className={styles.modalSection}>
            <div
              className={cx(
                styles.templateContainer,
                template === 'v1' && styles.templateContainerActive
              )}
            >
              <div
                className={cx(
                  styles.template,
                  styles.templatev1,
                )}
                onClick={() => onTemplateChange('v1')}
              />
              <div className={styles.templateWrapper}>
                <i className="fa fa-check-circle" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className={styles.modalSection}>
            <div
              className={cx(
                styles.templateContainer,
                template === 'v2' && styles.templateContainerActive
              )}
            >
              <div
                className={cx(
                  styles.template,
                  styles.templatev2,
                )}
                onClick={() => onTemplateChange('v2')}
              />
              <div className={styles.templateWrapper}>
                <i className="fa fa-check-circle" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};

export default TemplateModal;
