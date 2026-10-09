
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './AppContainer'
import AppStore, { history } from './redux/store'
import routes from './routes'

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
