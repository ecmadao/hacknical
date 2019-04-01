
import 'particles.js'
import renderApp from 'PAGES/login'
import { REMOTE_ASSETS } from 'UTILS/constant'

$(() => {
  particlesJS.load(
    'login',
    REMOTE_ASSETS.PARTICLES_JS,
    Function.prototype
  )

  renderApp('login', {
    loginLink: window.loginLink,
    isMobile: window.isMobile === 'true' || window.isMobile === true
  })
})
