import React from 'react'
import { Switcher } from 'light-ui'
import TextPanel from '../TextPanel'

const SwitcherPanel = (props) => {
  const {
    checked,
    onChange,
    disabled = false,
    switcher = {
      size: 'normal',
      version: 'v2'
    },
    ...others
  } = props

  return (
    <TextPanel {...others}>
      <Switcher
        {...switcher}
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </TextPanel>
  )
}

export default SwitcherPanel
