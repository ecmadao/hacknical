
import 'SRC/vendor/shared/loading.css'
import renderApp from 'PAGES/sharePage/resume'

$(() => {
  renderApp('resume', {
    login: window.login,
    userId: window.userId
  })
})
