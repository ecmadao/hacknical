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

  const handleInputChange = field => (value) => {
    setForm({ ...form, [field]: value })
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
          <div className={cx(
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

// 重置密码确认组件
const ResetPasswordForm = () => {
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  // 从URL中获取token
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  const handleInputChange = field => (value) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.newPassword) {
      newErrors.newPassword = '请输入新密码'
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = '密码长度不能少于6位'
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.newPassword)) {
      newErrors.newPassword = '密码必须包含至少一个字母和一个数字'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = '请确认新密码'
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setMessage('重置链接无效')
      return
    }
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setLoading(true)
    setMessage('')
    setErrors({})

    try {
      const response = await API.user.confirmPasswordReset({
        token,
        newPassword: form.newPassword
      })
      if (response.success) {
        setMessage(response.message || '密码重置成功！')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      } else {
        setMessage(response.message || '重置失败')
      }
    } catch (error) {
      setMessage('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className={styles.emailAuthContainer}>
        <div className={styles.authHeader}>
          <h2 className={styles.authTitle}>重置链接无效</h2>
          <p className={styles.authSubtitle}>请重新申请密码重置</p>
        </div>
        <div className={styles.authLinks}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => window.location.href = '/forgot-password'}
          >
            重新申请重置
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.emailAuthContainer}>
      <div className={styles.authHeader}>
        <h2 className={styles.authTitle}>{emailText.resetPasswordTitle}</h2>
        <p className={styles.authSubtitle}>{emailText.resetPasswordSubtitle}</p>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <Input
            theme="dark"
            type="password"
            required={false}
            value={form.newPassword}
            placeholder={emailText.newPasswordPlaceholder}
            className={cx(
              styles.authInput,
              errors.newPassword && styles.inputError
            )}
            onChange={handleInputChange('newPassword')}
            validator={value => value && value.length >= 6}
          />
          {errors.newPassword && (
            <div className={styles.errorText}>{errors.newPassword}</div>
          )}
          <div className={styles.helpText}>{emailText.passwordHelp}</div>
        </div>

        <div className={styles.inputGroup}>
          <Input
            theme="dark"
            type="password"
            required={false}
            value={form.confirmPassword}
            placeholder={emailText.confirmPasswordPlaceholder}
            className={cx(
              styles.authInput,
              errors.confirmPassword && styles.inputError
            )}
            onChange={handleInputChange('confirmPassword')}
            validator={value => value && value.length >= 6}
          />
          {errors.confirmPassword && (
            <div className={styles.errorText}>{errors.confirmPassword}</div>
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
              &nbsp;{emailText.resetting}
            </div>
          ) : (
            emailText.resetPasswordButton
          )}
        </button>
      </form>
    </div>
  )
}

export { ForgotPasswordForm, ResetPasswordForm }
