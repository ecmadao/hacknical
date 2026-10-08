
import React from 'react'
import cx from 'classnames'
import { Button, Input, PortalModal } from 'light-ui'
import locales from 'LOCALES'
import message from 'UTILS/message'
import Icon from 'COMPONENTS/Icon'
import Hotkeys from 'UTILS/hotkeys'
import styles from '../styles/resume.css'
import modalStyles from '../styles/modal.css'

const resumeTexts = locales('resume')
const { navs, buttons, messages } = resumeTexts

class NavSection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      showModal: false
    }
    this.toggleModal = this.toggleModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
  }

  toggleModal() {
    const { showModal } = this.state
    this.setState({
      showModal: !showModal,
      title: !showModal ? '' : this.state.title
    })
    if (!showModal) {
      setTimeout(() => {
        const input = document.getElementById('newModuleInput')
        input && input.focus()
      }, 200)
    }
  }

  handleSubmit() {
    const { title } = this.state
    const { customModules = [], handleSubmit } = this.props
    const trimmedTitle = (title || '').trim()
    if (!trimmedTitle) {
      message.error(messages.addModuleError.emptyName)
      return
    }
    if (customModules.find(module => (module.title || module.text) === trimmedTitle)) {
      message.error(messages.addModuleError.duplicateName)
      return
    }

    this.setState({
      title: '',
      showModal: false
    })

    handleSubmit && handleSubmit(trimmedTitle)
  }

  handleEnter(e) {
    if (!Hotkeys.isEnter(e)) return
    e.preventDefault()
    this.handleSubmit()
  }

  onTitleChange(title) {
    this.setState({ title })
  }

  render() {
    const { title, showModal } = this.state

    return (
      <div className={styles.navSection}>
        <div className={styles.navSectionWrapper} onClick={this.toggleModal}>
          <Icon icon="plus" className={styles.navIcon} />
          {navs.addNew.nav}
        </div>
        <PortalModal
          showModal={showModal}
          onClose={this.toggleModal}
        >
          <div className={cx(modalStyles.modalContainer, styles.newModuleModal)}>
            <div className={styles.newModuleHeader}>
              <Icon icon="plus-circle" />
              &nbsp;&nbsp;
              {navs.addNew.nav}
            </div>
            <div className={styles.newModuleContent}>
              <Input
                value={title}
                id="newModuleInput"
                theme="borderless"
                subTheme="underline"
                className={styles.newModuleInput}
                onChange={this.onTitleChange}
                placeholder={navs.moduleName.nav}
                onKeyDown={this.handleEnter}
              />
            </div>
            <div className={styles.newModuleActions}>
              <Button
                theme="flat"
                color="white"
                onClick={this.toggleModal}
                value="取消"
                className={styles.modalCancelBtn}
              />
              &nbsp;&nbsp;
              <Button
                theme="flat"
                color="dark"
                onClick={this.handleSubmit}
                value={buttons.confirm}
                className={styles.button}
              />
            </div>
          </div>
        </PortalModal>
      </div>
    )
  }
}

export default NavSection
