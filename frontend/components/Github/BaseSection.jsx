
import React from 'react'
import cx from 'classnames'
import cardStyles from './styles/info_card.css'
import locales from 'LOCALES'
import { ClassicCard } from 'light-ui'

const operationTexts = locales('github.operations')

const BaseSection = (props) => {
  const {
    disabled,
    children,
    handleClick,
    cardClass = ''
  } = props

  return (
    <ClassicCard className={cardStyles.infoCard} bgClassName={cardStyles.cardBg}>
      <div className={cx(cardStyles.infoCardContent, cardClass)}>
        {disabled ? (
          <div
            onClick={handleClick}
            className={cardStyles.cardDisabled}
          >
            {operationTexts.share.enable}
          </div>
        ) : null}
        {children}
      </div>
    </ClassicCard>
  )
}

export default BaseSection
