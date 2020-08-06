
import React from 'react'
import cx from 'classnames'
import { PortalModal } from 'light-ui'
import locales from 'LOCALES'
import styles from '../../styles/template_modal.css'
import modalStyles from '../../styles/modal.css'
import { URLS } from 'UTILS/constant/github'
import { RESUME_TEMPLATES } from 'UTILS/constant'
import Icon from 'COMPONENTS/Icon'

const resumeTexts = locales('resume')

const TemplateModal = (props) => {
  const {
    onClose,
    template,
    openModal,
    onTemplateChange
  } = props

  const templates = RESUME_TEMPLATES.map((templateId, index) => (
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
          <Icon icon="check-circle" />
        </div>
      </div>
    </div>
  ))

  return (
    <PortalModal
      showModal={openModal}
      onClose={onClose}
    >
      <div
        className={cx(
          modalStyles.modalContainer,
          modalStyles.modalSmall,
          styles.modal
        )}
      >
        <div className={styles.header}>
          {resumeTexts.modal.chooseTemplate}
        </div>
        <div className={styles.modalWrapper}>
          {templates}
        </div>
        <div className={styles.bottom}>
          <a
            target="_blank"
            className={styles.link}
            rel="noopener noreferrer"
            href={`${URLS.ISSUE}/new?template=-feature--resume-template.md&title=Resume+template`}
          >
            {resumeTexts.modal.contributeTemplate}
          </a>
        </div>
      </div>
    </PortalModal>
  )
}

export default TemplateModal
