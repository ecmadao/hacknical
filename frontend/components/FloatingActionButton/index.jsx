
import React from 'react'
import cx from 'classnames'
import {
  AnimationComponent,
  FloatingActionButton
} from 'light-ui'
import styles from './fab.css'

const _FAB = (props) => {
  const {
    status,
    onTransitionEnd,
    ...otherProps
  } = props

  return (
    <div
      className={cx(
        styles.fab,
        styles[`fab-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <FloatingActionButton {...otherProps} />
    </div>
  )
}

const FAB = props => (
  <AnimationComponent>
    <_FAB {...props} />
  </AnimationComponent>
)

export default FAB
