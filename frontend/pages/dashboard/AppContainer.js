import React, { PropTypes } from 'react';
import { wrapRouter } from 'opbeat-react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

const OpbeatRouter = wrapRouter(Router);

class AppContainer extends React.Component {
  render() {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <OpbeatRouter history={history} >
          {routes}
        </OpbeatRouter>
      </Provider>
    );
  }
}

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default AppContainer;
