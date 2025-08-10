import React, { useState } from 'react'
import cx from 'classnames'
import API from 'API'
import Icon from 'COMPONENTS/Icon'
import { Input } from 'light-ui'
import styles from '../styles/login.css'
import locales from 'LOCALES'

const { emailAuth: emailText } = locales('login')

const EmailRegisterForm = ({ onSwitchToLogin, onBackToGithub }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
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
    } else if (form.password.length < 6) {
      newErrors.password = '密码长度不能少于6位'
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = '密码必须包含至少一个字母和一个数字'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
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
      const response = await API.user.registerByEmail({
        email: form.email,
        password: form.password,
        name: form.name || form.email.split('@')[0]
      })
      if (response.success) {
        setMessage(response.message || '注册成功！请检查你的邮箱进行验证。')
      } else {
        setMessage(response.message || '注册失败')
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
        <h2 className={styles.authTitle}>{emailText.registerTitle}</h2>
        <p className={styles.authSubtitle}>{emailText.registerSubtitle}</p>
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
            type="text"
            required={false}
            value={form.name}
            placeholder={emailText.namePlaceholder}
            className={styles.authInput}
            onChange={handleInputChange('name')}
          />
          <div className={styles.helpText}>{emailText.nameOptional}</div>
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
          <div
            className={cx(
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
              &nbsp;{emailText.registering}
            </div>
          ) : (
            emailText.registerButton
          )}
        </button>
      </form>

      <div className={styles.authLinks}>
        <button
          type="button"
          className={styles.linkButton}
          onClick={onSwitchToLogin}
        >
          {emailText.hasAccount}
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

export default EmailRegisterForm
