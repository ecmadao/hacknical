import React from 'react';
import cardStyles from './styles/info_card.css';
import locales from 'LOCALES';

const operationTexts = locales('github').operations;

const BaseSection = (props) => {
  const { disabled, children, handleClick } = props;
  return (
    <div className={cardStyles.info_card}>
      {disabled ? (
        <div
          onClick={handleClick}
          className={cardStyles.cardDisabled}
        >
          {operationTexts.share.enable}
        </div>
      ) : ''}
      {children}
    </div>
  );
};

export default BaseSection;
