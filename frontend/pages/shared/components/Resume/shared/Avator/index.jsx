
import React from 'react'
import cx from 'classnames'
import { Loading } from 'light-ui'
import AvatorComponent from 'COMPONENTS/Avator'
import styles from './avator.css'

const Avator = (props) => (
  <AvatorComponent
    src={props.src}
    className={cx(styles.avator, props.className)}
    loader={
      <Loading loading className={cx(styles.loader, props.className)} />
    }
  />
)

export default Avator
