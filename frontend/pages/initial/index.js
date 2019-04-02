

import React from 'react'
import ReactDOM from 'react-dom'
import InitialPanel from './container'

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <InitialPanel {...props} />,
    DOM
  )
}

export default renderApp
