
import React from 'react'
import {
  Tipso,
  Button,
  IconButton,
  ClassicButton,
  AnimationComponent
} from 'light-ui'
import cx from 'classnames'

import locales, { switchLanguage } from 'LOCALES'
import styles from '../styles/resume.css'
import Icon from 'COMPONENTS/Icon'
import Operations from 'COMPONENTS/Operations'

const resumeTexts = locales('resume')

const Wrapper = (props) => {
  const {
    status,
    posting,
    saveResume,
    handlePreview,
    downloadResume,
    saveDisabled,
    downloadDisabled,
    onTransitionEnd,
    handleShareModalStatus,
    handleIntroModalStatus,
    handleTemplateModalStatus,
    handleResumeListModalStatus,
    currentResumeTitle
  } = props

  const downloadOptions = [
    {
      text: resumeTexts.messages.downloadOptions.onePage,
      onClick: () => downloadResume('onePage')
    },
    {
      text: resumeTexts.messages.downloadOptions.clippedPages,
      onClick: () => downloadResume('clippedPages')
    }
  ]

  const resumesModalTexts = (resumeTexts.modal && resumeTexts.modal.resumes) || {}

  return (
    <div
      className={cx(
        styles.resume_operations,
        styles[`resume_operations-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles.operations_wrapper}>
        <Tipso
          trigger="hover"
          theme="dark"
          className={styles.icon_button_tipso}
          tipsoContent={(<span>{resumesModalTexts.switchTip || '切换 / 管理多份简历'}</span>)}
        >
          <div
            className={styles.resume_switcher_btn}
            onClick={() => handleResumeListModalStatus && handleResumeListModalStatus(true)}
          >
            <Icon icon="files-o" />
            <span className={styles.resume_title_text}>{currentResumeTitle || '默认简历'}</span>
            <Icon icon="angle-down" />
          </div>
        </Tipso>
        <IconButton
          color="gray"
          icon="question"
          className={styles.icon_button}
          onClick={() => handleIntroModalStatus(true)}
        />
        <Tipso
          trigger="hover"
          theme="dark"
          className={styles.icon_button_tipso}
          tipsoContent={(<span>{resumeTexts.messages.languageTip}</span>)}
        >
          <IconButton
            color="gray"
            icon="language"
            className={styles.icon_button}
            onClick={() => switchLanguage()}
          />
        </Tipso>
        <Tipso
          trigger="hover"
          theme="dark"
          className={styles.icon_button_tipso}
          tipsoContent={(<span>{resumeTexts.messages.templateTip}</span>)}
        >
          <IconButton
            color="gray"
            icon="file-text"
            className={styles.icon_button}
            onClick={() => handleTemplateModalStatus(true)}
          />
        </Tipso>
        <Operations
          trigger="click"
          disabled={downloadDisabled}
          items={downloadOptions}
        >
          <Tipso
            trigger="hover"
            theme="dark"
            className={styles.icon_button_tipso}
            tipsoContent={(<span>{resumeTexts.messages.downloadTip}</span>)}
          >
            <IconButton
              color="gray"
              icon="download"
              className={styles.icon_button}
              disabled={downloadDisabled}
            />
          </Tipso>
        </Operations>
        <IconButton
          color="gray"
          icon="share-alt"
          className={styles.icon_button}
          onClick={() => handleShareModalStatus(true)}
        />
        &nbsp;&nbsp;
        <ClassicButton
          theme="dark"
          disabled={saveDisabled}
        >
          <Button
            color="dark"
            disabled={saveDisabled}
            onClick={handlePreview}
            className={styles.operation}
            value={resumeTexts.buttons.preview}
            leftIcon={(
              <Icon icon="file-text-o" />
            )}
          />
        </ClassicButton>
        &nbsp;&nbsp;&nbsp;
        <ClassicButton
          theme="green"
          disabled={saveDisabled}
        >
          <Button
            disabled={saveDisabled}
            theme="none"
            value={posting
              ? resumeTexts.buttons.saving
              : resumeTexts.buttons.save}
            className={styles.operation}
            onClick={() => saveResume('message=1')}
            leftIcon={(
              <Icon icon="save" />
            )}
          />
        </ClassicButton>
      </div>
    </div>
  )
}

const ResumeOperations = props => (
  <AnimationComponent>
    <Wrapper {...props} />
  </AnimationComponent>
)

export default ResumeOperations
