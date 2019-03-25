/* eslint new-cap: "off" */
import { injectReducer } from '../redux/reducer'
import initReducers from './App/redux/reducers'
import App from './App'
import Github from './Github'
import Records from './Records'
import Resume from './Resume'
import Setting from './Setting'

export const createRoutes = (store, props) => {
  const {
    login,
    device,
    dashboardRoute,
    isAdmin = false,
    isMobile = false
  } = props

  injectReducer(store, {
    key: 'app',
    reducer: initReducers({
      login,
      isAdmin,
      isMobile,
      activeTab: dashboardRoute
    })
  })
  const options = {
    login,
    device,
    isMobile,
    dashboardRoute
  }
  return [{
    component: App,
    routes: [
      Records(store, options),
      Resume(store, options),
      Github(store, options),
      Setting(store, options)
    ]
  }]
}

export default createRoutes
