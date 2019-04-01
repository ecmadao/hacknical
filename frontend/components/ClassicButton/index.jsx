
import React from 'react'
import cx from 'classnames'
import styles from './button.css'

class ClassicButton extends React.PureComponent {
  render() {
    const {
      theme, // light or dark
      content,
      className,
      buttonContainerClassName,
      onClick = Function.prototype
    } = this.props
    return (
      <div
        onClick={onClick}
        className={cx(
          styles.buttonContainer,
          buttonContainerClassName
        )}
      >
        <div
          className={cx(
            styles.buttonWrapper,
            styles[`wrapper_${theme}`]
          )}
        >
          <div className={cx(styles.buttonContent, className)}>
            {content}
          </div>
        </div>
      </div>
    )
  }
}

export default ClassicButton
