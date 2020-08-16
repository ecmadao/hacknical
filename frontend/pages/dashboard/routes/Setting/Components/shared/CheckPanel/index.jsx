
import React from 'react'
import cx from 'classnames'
import styles from './panel.css'
import Icon from 'COMPONENTS/Icon'

const CheckPanel = (props) => {
  const {
    text,
    disabled,
    checked,
    onChange,
    className
  } = props

  return (
    <div
      onClick={() => {
        !disabled && onChange(!checked)
      }}
      className={cx(
        styles.infoContainerLarge,
        styles.checkInfoContainer,
        disabled && styles.disabled,
        className
      )}
    >
      <div className={styles.info}>
        {text}
      </div>
      <div className={styles.checkContainer}>
        <Icon icon={checked ? 'check-square' : 'square-o'} />
      </div>
    </div>
  )
}

export default CheckPanel
