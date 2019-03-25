
import React from 'react'
import cx from 'classnames'
import styles from '../styles/setting.css'
import Icon from 'COMPONENTS/Icon'

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
        <Icon icon={checked ? 'check-square' : 'square-o'} />
      </div>
    </div>
  );
};

export default CheckPanel;
