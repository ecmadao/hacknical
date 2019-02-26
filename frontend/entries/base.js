
import 'normalize.css'
import 'STYLES/fonts.css'
import 'STYLES/fonts-login.css'
import 'SRC/vendor/base/base.css'
import 'font-awesome/css/font-awesome.css'
import * as Sentry from '@sentry/browser'

if (process.env.SENTRY) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY
    })
  } catch (e) {
    console.error(e)
  }
}
