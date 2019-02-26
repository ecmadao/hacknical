
import renderApp from 'PAGES/dashboard'
import 'SRC/vendor/dashboard.css'
import API from 'API'

const renderOctocat = () =>
  API.github.octocat().then(console.log)

$(() => {
  renderApp('root', {
    login: window.login,
    device: window.device,
    isAdmin: window.isAdmin === 'true',
    isMobile: window.isMobile === 'true',
    dashboardRoute: window.dashboardRoute || 'visualize'
  })
  renderOctocat()
})
