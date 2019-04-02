
import 'STYLES/fonts-hack.css'
import renderApp from 'PAGES/initial'

$(() => {
  $(document).bind('contextmenu', () => false)

  renderApp('initial', {
    login: window.login
  })
})
