import React from 'react'
import ReactDOM from 'react-dom'
import { ForgotPasswordForm } from './components/PasswordResetForm'
import styles from './styles/login.css'

const ForgotPasswordPage = () => {
  return (
    <div className={styles.loginPannel}>
      <ForgotPasswordForm
        onBackToLogin={() => window.location.href = '/login'}
      />
    </div>
  )
}

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <ForgotPasswordPage {...props} />,
    DOM
  )
}

export default renderApp
