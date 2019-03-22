
import React from 'react'
import { connect } from 'react-redux'
import { renderRoutes } from 'react-router-config'
import asyncComponent from 'COMPONENTS/AsyncComponent'
import AppAction from './redux/actions'

const dashboard = {
  mobile: asyncComponent(
    () => System.import('./Components/Mobile')
      .then(component => component.default)
  ),
  desktop: asyncComponent(
    () => System.import('./Components/Desktop')
      .then(component => component.default)
  )
}

class App extends React.Component {
  componentWillMount() {
    // https://github.com/ReactTraining/react-router/issues/3854
    const {
      app,
      history
    } = this.props
    const { login, activeTab } = app
    history.replace(`/${login}/${activeTab}`)
  }

  render() {
    const {
      app,
      route,
      location,
      changeActiveTab
    } = this.props
    const dashboardType = app.isMobile ? 'mobile' : 'desktop'
    const Dashboard = dashboard[dashboardType]
    const routes = renderRoutes(route.routes)
    return (
      <Dashboard
        routes={routes}
        location={location}
        changeActiveTab={changeActiveTab}
        {...app}
      />
    )
  }
}

const mapStateToProps = state => ({ app: state.app })

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (tab) => {
      dispatch(AppAction.changeTab(tab))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
