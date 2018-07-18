
import React from 'react';
import cx from 'classnames';
import styles from '../styles/setting.css';

const CheckPanel = (props) => {
  const {
    text,
    checked,
    onChange,
    className
  } = props;

  return (
    <div
      onClick={() => onChange(!checked)}
      className={cx(
        styles.info_container_large,
        styles.check_info_container,
        className
      )}
    >
      <div className={styles.info}>
        {text}
      </div>
      <div className={styles.check_container}>
        <i
          aria-hidden="true"
          className={`fa fa-${checked ? 'check-square' : 'square-o'}`}
        />
      </div>
    </div>
  );
};

export default CheckPanel;
