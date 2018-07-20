import React from 'react';
import styles from './card.css';

const MinInfoCard = (props) => {
  const { mainText, subText, className, icon } = props;
  return (
    <div className={className}>
      <div className={styles.subText}>
        {subText}
      </div>
      <div className={styles.mainText}>
        {icon ? (
          <i className={`fa fa-${icon}`} aria-hidden="true" />
        ) : null}
        {mainText}
      </div>
    </div>
  );
};

MinInfoCard.defaultProps = {
  mainText: '',
  subText: '',
  className: '',
  icon: '',
};

export default MinInfoCard;
