import React from 'react';
import cx from 'classnames';
import { PortalModal } from 'light-ui';
import styles from '../../styles/template_modal.css';
import modalStyles from '../../styles/modal.css';

const TEMPLATES = [
  'v1',
  'v2',
  'v3'
];

const TemplateModal = (props) => {
  const {
    onClose,
    template,
    openModal,
    onTemplateChange
  } = props;

  const templates = TEMPLATES.map((templateId, index) => (
    <div className={styles.modalSection} key={index}>
      <div
        className={cx(
          styles.templateContainer,
          template === templateId && styles.templateContainerActive
        )}
      >
        <div
          className={cx(
            styles.template,
            styles[`template${templateId}`],
          )}
          onClick={() => onTemplateChange(templateId)}
        />
        <div className={styles.templateWrapper}>
          <i className="fa fa-check-circle" aria-hidden="true" />
        </div>
      </div>
    </div>
  ));

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
          {templates}
        </div>
      </div>
    </PortalModal>
  );
};

export default TemplateModal;
