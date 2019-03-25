
import React from 'react'
import cx from 'classnames'
import { FloatingActionButton, AnimationComponent } from 'light-ui'
import styles from './fab.css'

const _FAB = (props) => {
  const {
    status,
    onTransitionEnd
  } = props

  return (
    <div
      className={cx(
        styles.fab,
        styles[`fab-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <FloatingActionButton {...props} />
    </div>
  )
}

const FAB = props => (
  <AnimationComponent>
    <_FAB {...props} />
  </AnimationComponent>
)

export default FAB
