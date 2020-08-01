
import React from 'react'
import { Button, Input, Tipso } from 'light-ui'
import locales from 'LOCALES'
import message from 'UTILS/message'
import Icon from 'COMPONENTS/Icon'
import Hotkeys from 'UTILS/hotkeys'
import styles from '../styles/resume.css'

const resumeTexts = locales('resume')
const { navs, buttons, messages } = resumeTexts

class NavSection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: '',
      showModal: false
    }
    this.onTipClose = this.onTipClose.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
  }

  onTipClose() {
    this.setState({ showModal: false })
  }

  toggleModal() {
    const { showModal } = this.state
    this.setState({
      showModal: !showModal
    })
    if (!showModal) setTimeout(() => $('#newModule').focus(), 200)
  }

  handleSubmit() {
    const { title } = this.state
    const { customModules, handleSubmit } = this.props
    if (!title) {
      message.error(messages.addModuleError.emptyName)
      return
    }
    if (customModules.find(module => module.title === title)) {
      message.error(messages.addModuleError.duplicateName)
      return
    }

    this.setState({
      title: '',
      showModal: false
    })

    handleSubmit && handleSubmit(title)
  }

  handleEnter(e) {
    if (!Hotkeys.isEnter(e)) return
    this.handleSubmit()
  }

  onTitleChange(title) {
    this.setState({ title })
  }

  render() {
    const { title, showModal } = this.state

    return (
      <Tipso
        trigger="manual"
        theme="light"
        position="right"
        show={showModal}
        className={styles.icon_button_tipso}
        onTipClose={this.onTipClose}
        tipsoContent={(
          <div className={styles.navTipsoContent}>
            <Input
              value={title}
              id="newModule"
              theme="borderless"
              subTheme="underline"
              className={styles.input}
              onChange={this.onTitleChange}
              placeholder={navs.moduleName.nav}
              onKeyDown={this.handleEnter}
            />
            <Button
              theme="flat"
              color="dark"
              onClick={this.handleSubmit}
              value={buttons.confirm}
              className={styles.button}
            />
          </div>
        )}
        tipsoStyle={{
          top: '60%'
        }}
      >
        <div className={styles.navSection}>
          <div className={styles.navSectionWrapper} onClick={this.toggleModal}>
            <Icon icon="plus" className={styles.navIcon}/>
            {navs.addNew.nav}
          </div>
        </div>
      </Tipso>
    )
  }
}

export default NavSection
