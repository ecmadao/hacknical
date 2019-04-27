
import React from 'react'
import styles from './styles/setting.css'
import MobileSetting from '../Desktop/container'

const renderMobileSetting = props => (
  <MobileSetting
    card={{
      flat: true,
      style: {
        margin: '0',
        boxShadow: '1px 1px 2px 0 rgba(0,0,0,.1)'
      }
    }}
    switcher={{
      size: 'small',
      version: 'v3'
    }}
    cardHeaderClass={styles.cardHeader}
    {...props}
    className={styles.container}
  />
)

export default renderMobileSetting
