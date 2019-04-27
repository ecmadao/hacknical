
import React from 'react'
import cx from 'classnames'
import Clipboard from 'clipboard'
import { Input, IconButton } from 'light-ui'
import message from 'UTILS/message'
import styles from './panel.css'
import locales from 'LOCALES'

const modalTexts = locales('shareModal')

class InputPanel extends React.Component {
  constructor(props) {
    super(props)
    this.clipboard = null
  }

  componentDidMount() {
    const {
      inputId,
      buttonId
    } = this.props

    this.renderClipboard({
      inputId,
      buttonId,
    })
  }

  componentDidUpdate() {
    const {
      inputId,
      buttonId
    } = this.props

    this.removeClipboard()
    this.renderClipboard({
      inputId,
      buttonId,
    })
  }

  componentWillUnmount() {
    this.removeClipboard()
  }

  removeClipboard() {
    this.clipboard && this.clipboard.destroy()
  }

  renderClipboard(options) {
    const {
      inputId,
      buttonId,
    } = options
    this.clipboard = new Clipboard(`#${buttonId}`, {
      text: () => $(`#${inputId}`).val()
    })
    this.clipboard.on('success', () => {
      message.notice(modalTexts.notice.copy, 1800)
    })
    this.clipboard.on('error', () => {
      message.error(modalTexts.error.copy, 1800)
    })
  }

  render() {
    const {
      url,
      inputId,
      buttonId,
      disabled,
      className,
      input = {}
    } = this.props

    return (
      <div
        className={cx(
          styles.itemPane,
          className
        )}
      >
        <Input
          id={inputId}
          theme="flat"
          disabled={disabled}
          className={cx(
            styles.input,
            disabled ? styles.shareDisabled : ''
          )}
          value={url}
          {...input}
        />
        <div className={styles.iconContainer}>
          <IconButton
            color="gray"
            icon="clipboard"
            id={buttonId}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
}

export default InputPanel
