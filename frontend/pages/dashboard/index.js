
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import AppContainer from './AppContainer'
import AppStore from './redux/store'
import routes from './routes'

const history = createHistory()

const renderApp = (id, props = {}) => {
  const ROOT_DOM = document.getElementById(id)
  ReactDOM.render(
    <AppContainer
      store={AppStore}
      history={history}
      routes={routes(AppStore, props)}
      {...props}
    />,
    ROOT_DOM
  )
}

export default renderApp
