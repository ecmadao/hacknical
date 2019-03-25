import React from 'react'
import styles from './card.css'
import Icon from 'COMPONENTS/Icon'

const MinInfoCard = (props) => {
  const { mainText, subText, className, icon } = props

  return (
    <div className={className}>
      <div className={styles.subText}>
        {subText}
      </div>
      <div className={styles.mainText}>
        <Icon icon={icon} />
        {mainText}
      </div>
    </div>
  )
}

MinInfoCard.defaultProps = {
  mainText: '',
  subText: '',
  className: '',
  icon: '',
}

export default MinInfoCard
