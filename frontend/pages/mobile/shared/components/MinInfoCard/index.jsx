import React from 'react';
import styles from './card.css';

const MinInfoCard = (props) => {
  const { mainText, subText, className, icon } = props;
  return (
    <div className={className}>
      <div className={styles["info_sub_text"]}>
        {subText}
      </div>
      <div className={styles["info_main_text"]}>
        {icon ? (
          <i className={`fa fa-${icon}`} aria-hidden="true"></i>
        ) : ''}
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
