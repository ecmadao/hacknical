
import React from 'react'
import ReactDOM from 'react-dom'
import 'SRC/vendor/shared/loading.css'
import ResumeMobileShare from 'SHARED/components/Resume'

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <ResumeMobileShare {...props} />,
    DOM
  )
}

$(() => {
  renderApp('resume', {
    login: window.login,
    userId: window.userId,
    device: 'desktop'
  })
})
