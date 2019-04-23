
import React from 'react'
import cx from 'classnames'
import { Input } from 'light-ui'
import TipsoInputs from './TipsoInputs'
import styles from '../../../styles/resume.css'

const TipsoInput = (props) => {
  const {
    type,
    value,
    required,
    onChange,
    className,
    placeholder,
    disabled = false,
    prefixIcons = ['link'],
  } = props
  return (
    <TipsoInputs prefixIcons={prefixIcons}>
      {[
        <Input
          key="0"
          type={type}
          value={value}
          disabled={disabled}
          required={required}
          onChange={onChange}
          theme="borderless"
          subTheme="underline"
          className={cx(
            styles.tipso_input,
            className
          )}
          placeholder={placeholder}
        />
      ]}
    </TipsoInputs>
  )
}

TipsoInput.defaultProps = {
  value: '',
  type: 'url',
  required: false,
  placeholder: '',
  className: '',
  onChange: Function.prototype,
  disabled: false,
}

export default TipsoInput
