import React from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { removeDOM } from 'UTILS/helper'
import * as Sentry from '@sentry/browser'

class AppContainer extends React.Component {
  componentDidMount() {
    removeDOM('#loading', { async: true, timeout: 500 })

    const { login: name, isMobile } = this.props
    name && window.LogRocket && window.LogRocket.identify(name, {
      name,
      isMobile
    })

    if (window.LogRocket) {
      Sentry.configureScope((scope) => {
        scope.addEventProcessor(async (event) => {
          event.extra.sessionURL = window.LogRocket.sessionURL
          return event
        })
      })
    }
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  render() {
    const { history, routes, store } = this.props
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {renderRoutes(routes)}
        </ConnectedRouter>
      </Provider>
    )
  }
}

AppContainer.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
  store: PropTypes.object.isRequired
}

export default AppContainer
