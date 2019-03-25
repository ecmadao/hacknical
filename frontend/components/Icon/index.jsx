
import React from 'react'
import cx from 'classnames'

const Icon = props => props.hidden
  ? null
  : (
    <i
      className={cx(
        `fa fa-${props.icon}`,
        props.className
      )}
      aria-hidden="true"
      onClick={props.onClick || Function.prototype}
    />
  )

export default Icon
