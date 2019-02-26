
import React from 'react'
import ReactDOM from 'react-dom'
import GitHubMobileShare from 'SHARED/components/GitHub/Mobile'
import 'SRC/vendor/mobile/github.css'
import initialHeadroom from 'SRC/vendor/shared/headroom'

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <GitHubMobileShare
      {...props}
    />,
    DOM
  )
}

$(() => {
  renderApp('github', {
    isShare: true,
    login: window.login,
    isAdmin: window.isAdmin === 'true'
  })

  initialHeadroom('#share_banner')
})
