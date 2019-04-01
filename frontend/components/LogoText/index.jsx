
import React from 'react'
import cx from 'classnames'
import styles from './logo.css'

const LogoText = (props) => {
  const {
    className,
    theme = 'light',
    onClick = Function.prototype
  } = props

  return (
    <div
      className={cx(
        styles.logoContainer,
        className,
        styles[`logo_${theme}`]
      )}
      onClick={onClick}
    >
      <div className={styles.logoFront}>hacknical</div>
      <div className={styles.logoBack}>hacknical</div>
    </div>
  )
}

export default LogoText
