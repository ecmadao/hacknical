
import React from 'react'
import LogoText from 'COMPONENTS/LogoText'
import Terminal from 'COMPONENTS/Terminal'
import styles from './error.css'

const Error = (props) => {
  const { wordLines, onFinish } = props

  return (
    <div className={styles.pannel}>
      <div className={styles.left}>
        <LogoText theme="light" className={styles.logo} />
      </div>
      <div className={styles.right}>
        <Terminal
          className={styles.error}
          wordLines={wordLines}
          onFinish={onFinish}
          sleepMs={1000}
        />
      </div>
    </div>
  )
}

export default Error
