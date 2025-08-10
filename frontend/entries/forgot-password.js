import 'particles.js'
import renderApp from 'PAGES/forgot-password'
import { REMOTE_ASSETS } from 'UTILS/constant'

$(() => {
  particlesJS.load(
    'forgot-password',
    REMOTE_ASSETS.PARTICLES_JS,
    Function.prototype
  )

  renderApp('forgot-password', {})
})
