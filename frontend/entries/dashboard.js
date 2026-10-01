
import renderApp from 'PAGES/dashboard'
import 'SRC/vendor/dashboard.css'
import API from 'API'

const renderOctocat = () =>
  API.github.octocat().then(console.log)

$(() => {
  const isGitHubUser = window.isGitHubUser === 'true'
  renderApp('root', {
    login: window.login,
    device: window.device,
    isAdmin: window.isAdmin === 'true',
    isMobile: window.isMobile === 'true',
    isGitHubUser,
    dashboardRoute: window.dashboardRoute || (isGitHubUser ? 'visualize' : 'archive')
  })
  if (isGitHubUser) {
    renderOctocat()
  }
})
