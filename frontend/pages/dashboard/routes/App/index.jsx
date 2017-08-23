import React from 'react';
import { connect } from 'react-redux';
import TabBar from './Components/TabBar';
import Header from './Components/Header';
import styles from './styles/app.css';

const App = (props) => {
  const { children } = props;
  return (
    <div className={styles.app}>
      <div className={styles.app_top}>
        <Header />
        <TabBar />
      </div>
      <div className={styles.app_content}>
        <div className={styles.content_container}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default connect()(App);
