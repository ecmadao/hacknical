
import React from 'react'
import ReactDOM from 'react-dom'
import Error from 'PAGES/shared/components/Error'

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <Error {...props} />,
    DOM
  )
}

export default renderApp
