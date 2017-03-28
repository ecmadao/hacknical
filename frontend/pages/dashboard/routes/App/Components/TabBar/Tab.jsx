import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import { Tipso } from 'light-ui';
import styles from '../../styles/app.css';
import PATH from '../../../shared/path';

const Tab = (props) => {
  const { onChange, tab } = props;
  const { id, name, icon, enable, tipso } = tab;
  const tabClass = cx(
    "app_tab",
    enable && "enable"
  );

  return (
    <Tipso
      position="bottom"
      wrapperClass={styles['tab_container']}
      tipsoContent={tipso ? (
        <span className={styles['tab_tipso']}>{tipso}</span>
      ) : null}>
      <Link
        to={`${PATH.BASE_PATH}/${id}`}
        className={tabClass}
        activeClassName="app_tab_active"
        onClick={(e) => onChange(e, id, enable)}>
        <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
        {name}
      </Link>
    </Tipso>
  )
};

export default Tab;
