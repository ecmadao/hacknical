
import React from 'react'
import PropTypes from 'prop-types'
import {
  PortalModal,
  ShortMessage,
} from 'light-ui'
import FAB from 'COMPONENTS/FloatingActionButton'
import locales from 'LOCALES'
import ResumeComponent from 'SHARED/components/Resume/Desktop'
import styles from '../../styles/modal.css'

const resumeLocales = locales('dashboard.archive.resume')

const ResumeModal = (props) => {
  const {
    login,
    resume,
    onClose,
    onShare,
    onDownload,
    openModal,
    shareInfo
  } = props

  return (
    <PortalModal
      showModal={openModal}
      onClose={onClose}
    >
      <div className={styles.modalContainer}>
        <ResumeComponent
          login={login}
          resume={resume}
          shareInfo={shareInfo}
        />
        {openModal ? <ShortMessage text={resumeLocales.previewModal} /> : null}
      </div>
      <FAB
        icon="share-alt"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '15%',
          zIndex: '11'
        }}
        color="green"
        onClick={onShare}
      />
      <FAB
        icon="download"
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '15%',
          zIndex: '11'
        }}
        color="green"
        onClick={onDownload}
      />
    </PortalModal>
  )
}

ResumeModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  onShare: PropTypes.func,
  onDownload: PropTypes.func,
  resume: PropTypes.object,
  shareInfo: PropTypes.object
}

ResumeModal.defaultProps = {
  openModal: false,
  onClose: Function.prototype,
  onShare: Function.prototype,
  onDownload: Function.prototype,
  resume: {},
  shareInfo: {}
}

export default ResumeModal
