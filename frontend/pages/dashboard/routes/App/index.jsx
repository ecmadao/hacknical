import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TabBar from './Components/TabBar/index';
import Header from './Components/Header/index';
import styles from './styles/app.css';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles["app"]}>
        <div className={styles["app_top"]}>
          <Header />
          <TabBar />
        </div>
        <div className={styles["app_content"]}>
          <div className={styles["content_container"]}>
            {children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(App);
