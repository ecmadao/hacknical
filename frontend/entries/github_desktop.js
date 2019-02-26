
import React from 'react'
import ReactDOM from 'react-dom'
import GitHubComponent from 'SHARED/components/GitHub/Desktop'
import 'SRC/vendor/share.css'
import initialHeadroom from 'SRC/vendor/shared/headroom'

const renderApp = (domId, props = {}) => {
  ReactDOM.render(
    <GitHubComponent
      {...props}
    />,
    document.getElementById(domId)
  )
}

$(() => {
  renderApp('share', {
    login: window.login,
    isShare: window.isShare,
    isAdmin: window.isAdmin === 'true'
  })
  initialHeadroom('#share_banner')
})
