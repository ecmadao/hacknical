import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { Tipso } from 'light-ui';
import styles from '../../styles/app.css';
import PATH from '../../../shared/path';

const Tab = (props) => {
  const { onChange, tab, active } = props;
  const { id, name, icon, enable, tipso } = tab;

  const containerClass = cx(
    styles['tab_container'],
    enable && styles.enable,
    active && styles.active
  );

  return (
    <Tipso
      position="bottom"
      wrapperClass={containerClass}
      tipsoStyle={{
        transform: 'translate(-50%, 13px)'
      }}
      tipsoContent={tipso ? (
        <span className={styles['tab_tipso']}>{tipso}</span>
      ) : null}>
      <Link
        to={`${PATH.BASE_PATH}/${id}`}
        className={styles['app_tab']}
        onClick={(e) => onChange(e, id, enable)}>
        <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
        {name}
      </Link>
    </Tipso>
  )
};

export default Tab;
