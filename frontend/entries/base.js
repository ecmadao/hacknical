
import React from 'react'
import ReactDOM from 'react-dom'

import 'normalize.css'
import 'STYLES/fonts.css'
import 'STYLES/fonts-logo.css'
import 'SRC/vendor/base/base.css'
import 'font-awesome/css/font-awesome.css'
import * as Sentry from '@sentry/browser'
import Footer from 'PAGES/shared/components/Footer'

if (process.env.SENTRY) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY
    })
  } catch (e) {
    console.error(e)
  }
}

const renderFooter = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  if (!DOM) return

  ReactDOM.render(
    <Footer {...props} />,
    DOM
  )
}

$(() => {
  renderFooter('footer', {
    isMobile: window.isMobile === 'true' || window.isMobile === true
  })
})
