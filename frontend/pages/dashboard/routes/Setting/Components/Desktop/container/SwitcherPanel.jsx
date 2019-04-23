import React from 'react'
import cx from 'classnames'
import { Switcher, Tipso } from 'light-ui'
import styles from '../styles/setting.css'
import Icon from 'COMPONENTS/Icon'

const SwitcherPanel = (props) => {
  const {
    text,
    status,
    checked,
    onChange,
    className,
    tipso = null,
    disabled = false,
  } = props
  return (
    <div
      className={cx(
        styles.info_container,
        styles.panel,
        styles[`panel-${status}`],
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
      <Switcher
        onChange={onChange}
        checked={checked}
        version="v2"
        disabled={disabled}
      />
    </div>
  )
}

export default SwitcherPanel
