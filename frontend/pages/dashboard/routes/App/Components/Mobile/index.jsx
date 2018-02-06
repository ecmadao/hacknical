import React from 'react';
import cx from 'classnames';
import styles from '../../styles/mobile.css';
import Menus from './Menus';

const Mobile = (props) => {
  const {
    routes,
    login,
    locale,
    location,
    isAdmin,
    changeActiveTab
  } = props;
  return (
    <div className={styles.app}>
      <Menus
        login={login}
        locale={locale}
        location={location}
        changeActiveTab={changeActiveTab}
      />
      <div className={cx(styles.appContent, isAdmin && styles.adminContent)}>
        {routes}
      </div>
    </div>
  );
};

export default Mobile;
