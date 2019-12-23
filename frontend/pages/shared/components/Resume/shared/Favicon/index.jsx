
import React from 'react'
import Img from 'react-image'
import cx from 'classnames'
import { Loading } from 'light-ui'
import styles from './favicon.css'

const Favicon = props => (
  <Img
    alt={props.name}
    crossOrigin="anonymous"
    src={[
      `https://besticon-demo.herokuapp.com/icon?url=${props.src.replace(/^(https?:)?\/\//, '')}&size=80..120..200`,
      require('SRC/images/browser.png')
    ]}
    loader={
      <Loading
        loading
        className={cx(styles.favicon, styles.loader, props.className)}
      />
    }
    unloader={
      <img
        alt={props.name}
        src={require('SRC/images/browser.png')}
        className={cx(styles.favicon, props.className)}
      />
    }
    className={cx(styles.favicon, props.className)}
  />
)

export default Favicon
