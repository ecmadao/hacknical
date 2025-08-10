import React, { useState } from 'react'
import cx from 'classnames'
import API from 'API'
import Icon from 'COMPONENTS/Icon'
import { Input } from 'light-ui'
import styles from '../styles/login.css'
import locales from 'LOCALES'

const { emailAuth: emailText } = locales('login')

const EmailLoginForm = ({ onSwitchToRegister, onBackToGithub }) => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleInputChange = field => (value) => {
    setForm({ ...form, [field]: value })
    // 清除相关错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '邮箱格式不正确'
    }
    if (!form.password) {
      newErrors.password = '请输入密码'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setLoading(true)
    setMessage('')
    setErrors({})

    try {
      const response = await API.user.loginByEmail(form)
      if (response.success) {
        setMessage('登录成功！正在跳转...')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setMessage(response.message || '登录失败')
      }
    } catch (error) {
      setMessage('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.emailAuthContainer}>
      <div className={styles.authHeader}>
        <h2 className={styles.authTitle}>{emailText.loginTitle}</h2>
        <p className={styles.authSubtitle}>{emailText.loginSubtitle}</p>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <Input
            theme="dark"
            type="email"
            required={false}
            value={form.email}
            placeholder={emailText.emailPlaceholder}
            className={cx(
              styles.authInput,
              errors.email && styles.inputError
            )}
            onChange={handleInputChange('email')}
            validator={value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
          />
          {errors.email && (
            <div className={styles.errorText}>{errors.email}</div>
          )}
        </div>

        <div className={styles.inputGroup}>
          <Input
            theme="dark"
            type="password"
            required={false}
            value={form.password}
            placeholder={emailText.passwordPlaceholder}
            className={cx(
              styles.authInput,
              errors.password && styles.inputError
            )}
            onChange={handleInputChange('password')}
            validator={value => value && value.length >= 6}
          />
          {errors.password && (
            <div className={styles.errorText}>{errors.password}</div>
          )}
        </div>

        {message && (
          <div className={cx(
            styles.message,
            message.includes('成功') ? styles.successMessage : styles.errorMessage
          )}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cx(styles.authButton, styles.classicButton)}
        >
          {loading ? (
            <div>
              <Icon icon="spinner" spin />
              &nbsp;{emailText.loggingIn}
            </div>
          ) : (
            emailText.loginButton
          )}
        </button>
      </form>

      <div className={styles.authLinks}>
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => window.location.href = '/forgot-password'}
        >
          {emailText.forgotPassword}
        </button>
        <div className={styles.authSeparator}>
          <span>{emailText.or}</span>
        </div>
        <button
          type="button"
          className={styles.linkButton}
          onClick={onSwitchToRegister}
        >
          {emailText.noAccount}
        </button>
        <button
          type="button"
          className={styles.linkButton}
          onClick={onBackToGithub}
        >
          {emailText.backToGithub}
        </button>
      </div>
    </div>
  )
}

export default EmailLoginForm
