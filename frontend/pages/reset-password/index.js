import React from 'react'
import ReactDOM from 'react-dom'
import { ResetPasswordForm } from '../login/components/PasswordResetForm'
import styles from '../login/styles/login.css'

const ResetPasswordPage = () => {
  return (
    <div className={styles.loginPannel}>
      <ResetPasswordForm />
    </div>
  )
}

const renderApp = (domId, props = {}) => {
  const DOM = document.getElementById(domId)
  ReactDOM.render(
    <ResetPasswordPage {...props} />,
    DOM
  )
}

export default renderApp
