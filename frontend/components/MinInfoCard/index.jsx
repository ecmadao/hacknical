import React from 'react'
import styles from './card.css'
import Icon from 'COMPONENTS/Icon'
import { ClassicCard } from 'light-ui'

const MinInfoCard = (props) => {
  const { mainText, subText, className, icon } = props

  return (
    <ClassicCard bgClassName={styles.cardBg} hoverable={false}>
      <div className={className}>
        <div className={styles.subText}>
          {subText}
        </div>
        <div className={styles.mainText}>
          <Icon icon={icon} />
          {mainText}
        </div>
      </div>
    </ClassicCard>
  )
}

MinInfoCard.defaultProps = {
  mainText: '',
  subText: '',
  className: '',
  icon: ''
}

export default MinInfoCard
