/* eslint global-require: "off" */

import React from 'react'
import ReactDOM from 'react-dom'
import LoginPanel from './container'

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <LoginPanel {...props} />,
    DOM
  )
}

export default renderApp
