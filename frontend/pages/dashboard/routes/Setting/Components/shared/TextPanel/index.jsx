import React from 'react'
import cx from 'classnames'
import { Tipso } from 'light-ui'
import styles from './panel.css'
import Icon from 'COMPONENTS/Icon'

const TextPanel = (props) => {
  const {
    text,
    children,
    className,
    tipso = null,
  } = props

  return (
    <div
      className={cx(
        styles.itemPane,
        className
      )}
    >
      <div className={styles.info}>
        {text}
        {tipso ? (
          <Tipso
            theme="dark"
            className={styles.tipso}
            wrapperClass={styles.tipsoWrapper}
            tipsoContent={<span>{tipso}</span>}
          >
            <span className={styles.tipsoIntro}>
              <Icon icon="question-circle" />
            </span>
          </Tipso>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export default TextPanel
