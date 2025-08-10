import 'particles.js'
import renderApp from 'PAGES/reset-password'
import { REMOTE_ASSETS } from 'UTILS/constant'

$(() => {
  particlesJS.load(
    'reset-password',
    REMOTE_ASSETS.PARTICLES_JS,
    Function.prototype
  )

  renderApp('reset-password', {})
})
