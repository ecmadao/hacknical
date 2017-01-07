import React, { PropTypes } from 'react'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

class AppContainer extends React.Component {

  render() {
    const { history, routes, store } = this.props

    return (
      <Provider store={store}>
        <Router history={history} >
          {routes}
        </Router>
      </Provider>
    )
  }
}

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default AppContainer
