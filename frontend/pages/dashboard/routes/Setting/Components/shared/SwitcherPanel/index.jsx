import React from 'react'
import cx from 'classnames'
import { Switcher, Tipso } from 'light-ui'
import styles from './panel.css'
import Icon from 'COMPONENTS/Icon'

const SwitcherPanel = (props) => {
  const {
    text,
    checked,
    onChange,
    className,
    tipso = null,
    disabled = false,
    switcher = {
      size: 'normal',
      version: 'v2'
    }
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
      <Switcher
        {...switcher}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  )
}

export default SwitcherPanel
