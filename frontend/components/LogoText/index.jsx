
import React from 'react'
import cx from 'classnames'
import styles from './logo.css'
import { AnimationComponent, ClassicText } from 'light-ui'

const _LogoText = (props) => {
  const {
    status,
    className
  } = props

  const textClassName = cx(
    className,
    styles.logoContainer,
    styles[`logoContainer-${status}`]
  )

  return (
    <ClassicText
      {...props}
      className={textClassName}
      text={props.text || 'hacknical'}
    />
  )
}

const LogoText = props => (
  <AnimationComponent>
    <_LogoText {...props} />
  </AnimationComponent>
)

export default LogoText
