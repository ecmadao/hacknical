import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { removeDOM } from 'UTILS/helper';

class AppContainer extends React.Component {
  componentDidMount() {
    setTimeout(() => removeDOM('#loading'), 500);
  }

  render() {
    const { history, routes, store } = this.props;
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </Provider>
    );
  }
}

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  store: PropTypes.object.isRequired,
};

export default AppContainer;
