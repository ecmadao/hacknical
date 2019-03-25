
import React from 'react'
import cx from 'classnames'
import cardStyles from './styles/info_card.css'
import locales from 'LOCALES'

const operationTexts = locales('github.operations')

const BaseSection = (props) => {
  const {
    disabled,
    children,
    handleClick,
    cardClass = ''
  } = props

  return (
    <div className={cx(cardStyles.info_card, cardClass)}>
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
  )
}

export default BaseSection
