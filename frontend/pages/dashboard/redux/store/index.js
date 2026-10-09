
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'

import appReducer from '../reducer'

export const history = createBrowserHistory()

export const createAppStore = (initialState = {}, customHistory = history) => {
  const logger = createLogger()
  const router = routerMiddleware(customHistory)

  const mids = [
    thunk
  ]
  if (window.LogRocket) mids.push(window.LogRocket.reduxMiddleware())
  if (process.env.NODE_ENV !== 'production') {
    mids.unshift(logger)
  }
  mids.unshift(router)
  const middlewares = applyMiddleware(...mids)

  const AppStore = createStore(appReducer, initialState, middlewares)

  AppStore.asyncReducers = {}
  return AppStore
}

export default createAppStore()
