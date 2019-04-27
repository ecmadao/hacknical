
import React from 'react'
import cx from 'classnames'
import { AnimationComponent } from 'light-ui'
import styles from './panel.css'

const BasePanel = props => (
  <div
    className={cx(
      styles.panel,
      styles[`panel-${props.status}`],
      props.className
    )}
    onTransitionEnd={props.onTransitionEnd}
  >
    {props.children}
  </div>
)

const Panel = props => (
  <AnimationComponent>
    <BasePanel {...props} />
  </AnimationComponent>
)

export default Panel
