import React from 'react';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { bindActionCreators } from 'redux';
import TabBar from './Components/TabBar';
import Header from './Components/Header';
import styles from './styles/app.css';
import appActions from './redux/actions';

class App extends React.Component {
  componentDidMount() {
    this.props.actions.login();
  }

  componentWillMount() {
    // https://github.com/ReactTraining/react-router/issues/3854
    const {
      history,
      location,
    } = this.props;
    history.replace(`${location.pathname}/github`);
  }

  render() {
    const { route } = this.props;
    return (
      <div className={styles.app}>
        <div className={styles.app_top}>
          <Header />
          <TabBar />
        </div>
        <div className={styles.app_content}>
          <div className={styles.content_container}>
            {renderRoutes(route.routes)}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
