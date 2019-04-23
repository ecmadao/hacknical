
import React from 'react'
import styles from '../../../styles/resume.css'
import Icon from 'COMPONENTS/Icon'

const TipsoInputs = (props) => {
  const {
    children,
    prefixIcons
  } = props

  const inputs = []
  children.forEach((child, i) => {
    let prefix = null
    if (prefixIcons[i]) {
      prefix = (
        <Icon icon={prefixIcons[i]} />
      )
    }
    inputs.push((
      <div className={styles.tipsoInput} key={i}>
        {prefix}
        {child}
      </div>
    ))
  })

  return (
    <div className={styles.project_link_wrapper}>
      {inputs}
    </div>
  )
}

export default TipsoInputs
