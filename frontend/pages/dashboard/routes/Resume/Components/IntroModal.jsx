import React from 'react'
import PropTypes from 'prop-types'
import { PortalModal } from 'light-ui'
import styles from '../styles/intro_modal.css'

class IntroModal extends React.Component {
  renderIntros() {
    const { intros } = this.props
    return intros.map((intro, index) => {
      const { texts, title } = intro
      const lis = texts.map((text, i) => (<li key={i}>{text}</li>))

      return (
        <div className={styles['container-wrapper']} key={index}>
          <div className={styles.header}>{title}</div>
          <ul className={styles.content}>
            {lis}
          </ul>
        </div>
      )
    })
  }

  render() {
    const { openModal, onClose } = this.props
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}
      >
        <div className={styles.container}>
          {this.renderIntros()}
        </div>
      </PortalModal>
    )
  }
}

IntroModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  intros: PropTypes.array
}

IntroModal.defaultProps = {
  openModal: false,
  onClose: Function.prototype,
  intros: []
}

export default IntroModal
