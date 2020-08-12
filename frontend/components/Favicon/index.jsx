
import React from 'react'
import Img from 'react-image'
import cx from 'classnames'
import { Loading } from 'light-ui'
import styles from './favicon.css'
import API from 'API'

const defaultIcon = require('SRC/images/browser.png')

const getIconUrls = (props) => {
  const res = [props.fallback]
  if (props.src && props.size && props.src.replace(/^(https?:)?\/\//, '')) {
    res.unshift(
      API.home.icon({ url: props.src.replace(/^(https?:)?\/\//, ''), size: props.size})
    )
  }

  return res
}

const Favicon = props => (
  <Img
    alt={props.name}
    crossOrigin="anonymous"
    src={getIconUrls(props)}
    loader={
      props.loader || (
        <Loading
          loading
          className={cx(styles.favicon, styles.loader, props.className)}
        />
      )
    }
    unloader={
      props.unloader || (
        <img
          alt={props.name}
          src={require('SRC/images/browser.png')}
          className={cx(styles.favicon, props.className)}
        />
      )
    }
    className={cx(styles.favicon, props.className)}
  />
)

Favicon.defaultProps = {
  fallback: defaultIcon,
  name: 'favicon',
  size: '80',
  className: '',
  loader: null,
  unloader: null
}

export default Favicon
