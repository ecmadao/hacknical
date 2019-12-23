
import React from 'react'
import cx from 'classnames'
import Img from 'react-image'
import { Loading } from 'light-ui'
import styles from './styles.css'

const Avator = props => (
  <Img
    crossOrigin="anonymous"
    src={props.src}
    className={cx(styles.image, props.className)}
    loader={
      props.loader
      || <Loading loading className={cx(styles.image, styles.loader, props.className)} />
    }
    unloader={props.unloader}
  />
)

export default Avator
