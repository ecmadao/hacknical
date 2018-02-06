import React from 'react';
import Header from './Header';
import TabBar from './TabBar';
import styles from '../../styles/desktop.css';

const Desktop = (props) => {
  const {
    routes,
    login,
    activeTab,
    tabBarActive,
    changeActiveTab,
  } = props;

  return (
    <div className={styles.app}>
      <div className={styles.app_top}>
        <Header />
        <TabBar
          login={login}
          activeTab={activeTab}
          tabBarActive={tabBarActive}
          changeActiveTab={changeActiveTab}
        />
      </div>
      <div className={styles.app_content}>
        <div className={styles.content_container}>
          {routes}
        </div>
      </div>
    </div>
  );
};

export default Desktop;
