import React, { useState } from 'react'
import cx from 'classnames'
import API from 'API'
import Icon from 'COMPONENTS/Icon'
import { Input } from 'light-ui'
import styles from '../styles/login.css'
import locales from 'LOCALES'

const { emailAuth: emailText } = locales('login')

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [form, setForm] = useState({
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const handleInputChange = (field) => {
    return (value) => {
      setForm({ ...form, [field]: value })
      if (errors[field]) {
        setErrors({ ...errors, [field]: '' })
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '邮箱格式不正确'
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
      const response = await API.user.requestPasswordReset(form)
      if (response.success) {
        setMessage(response.message || '重置邮件已发送，请检查你的邮箱')
      } else {
        setMessage(response.message || '发送失败')
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
        <h2 className={styles.authTitle}>{emailText.forgotPasswordTitle}</h2>
        <p className={styles.authSubtitle}>{emailText.forgotPasswordSubtitle}</p>
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

        {message && (
          <div
            className={cx(
              styles.message,
              message.includes('发送') || message.includes('重置') ? styles.successMessage : styles.errorMessage
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
              &nbsp;{emailText.sending}
            </div>
          ) : (
            emailText.sendResetEmail
          )}
        </button>
      </form>

      <div className={styles.authLinks}>
        <button
          type="button"
          className={styles.linkButton}
          onClick={onBackToLogin}
        >
          {emailText.backToLogin}
        </button>
      </div>
    </div>
  )
}

export { ForgotPasswordForm }
