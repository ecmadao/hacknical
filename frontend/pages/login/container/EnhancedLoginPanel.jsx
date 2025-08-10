import React, { useState } from 'react'
import cx from 'classnames'
import API from 'API'
import Icon from 'COMPONENTS/Icon'
import styles from '../styles/login.css'
import locales, { getLocale } from 'LOCALES'
import LogoText from 'COMPONENTS/LogoText'
import Terminal from 'COMPONENTS/Terminal'
import { ClassicButton } from 'light-ui'
import EmailLoginForm from '../components/EmailLoginForm'
import EmailRegisterForm from '../components/EmailRegisterForm'

const {
  login: loginText,
  statistic: statisticText
} = locales('login')
const locale = getLocale()

const LOGIN_MODES = {
  GITHUB: 'github',
  EMAIL_LOGIN: 'email_login',
  EMAIL_REGISTER: 'email_register'
}

const EnhancedLoginPanel = ({ loginLink, ...props }) => {
  const [currentMode, setCurrentMode] = useState(LOGIN_MODES.GITHUB)
  const [loading, setLoading] = useState(true)
  const [statistic, setStatistic] = useState({})
  const [languages, setLanguages] = useState([])

  React.useEffect(() => {
    getLanguages()
    getStatistic()
  }, [])

  const getLanguages = async () => {
    try {
      const langs = await API.home.languages()
      setLanguages(langs || [])
    } catch (error) {
      console.error('Failed to fetch languages:', error)
    }
  }

  const getStatistic = async () => {
    try {
      const stats = await API.home.statistic()
      const {
        users,
        github = {},
        resume = {}
      } = (stats || {})

      const usersCount = Number(users || 0)
      const githubPageview = (github && github.pageview) || 0
      const resumePageview = (resume && resume.pageview) || 0
      const resumeCount = (resume && resume.count) || 0
      const resumeDownload = (resume && resume.download) || 0
      const resumeNum = Number(resumeCount) + Number(resumeDownload)

      setStatistic({
        usersCount,
        githubPageview,
        resumePageview,
        resumeNum
      })
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderLanguages = () => {
    return languages.map((language, index) => {
      const { locale: lang, text, url } = language
      return (
        <a 
          key={index}
          href={url}
          className={cx(
            styles.topbarLink,
            lang === locale && styles.active
          )}
        >
          {text}
        </a>
      )
    })
  }

  const renderStatistic = () => {
    if (loading) return null

    const {
      usersCount,
      githubPageview,
      resumePageview,
      resumeNum
    } = statistic

    return (
      <div className={cx(styles.statisticModal, props.isMobile && styles.statisticModalBottom)}>
        <strong className={styles.statisticUsers}>
          {usersCount}
        </strong>
        {statisticText.developers}
        <br />
        <strong className={styles.statisticGitHubPv}>
          {githubPageview}
        </strong>
        {statisticText.githubPageview}
        <br />
        <strong className={styles.statisticResumePv}>
          {resumePageview}
        </strong>
        {statisticText.resumePageview}
        <br />
        <strong className={styles.statisticResume}>
          {resumeNum}
        </strong>
        {statisticText.resumes}
        <br />
      </div>
    )
  }

  const renderGithubLogin = () => (
    <div className={styles.githubLoginContainer}>
      <LogoText theme="light" className={styles.logo} />
      <ClassicButton
        theme="light"
        onClick={() => window.location = loginLink}
        buttonContainerClassName={styles.loginButton}
      >
        <a
          href={loginLink}
          className={styles.githubLoginLink}
        >
          <Icon icon="github" />
          &nbsp;
          {loginText.loginButton}
        </a>
      </ClassicButton>
      
      <div className={styles.authSeparator}>
        <span>或者</span>
      </div>
      
      <ClassicButton
        theme="light"
        onClick={() => setCurrentMode(LOGIN_MODES.EMAIL_LOGIN)}
        buttonContainerClassName={styles.emailLoginButton}
      >
        <Icon icon="envelope" />
        &nbsp;
        使用邮箱登录
      </ClassicButton>
      
      <Terminal
        className={styles.loginIntro}
        wordLines={[`$ ${loginText.loginText}`]}
      />
    </div>
  )

  const renderCurrentMode = () => {
    switch (currentMode) {
      case LOGIN_MODES.EMAIL_LOGIN:
        return (
          <EmailLoginForm
            onSwitchToRegister={() => setCurrentMode(LOGIN_MODES.EMAIL_REGISTER)}
            onBackToGithub={() => setCurrentMode(LOGIN_MODES.GITHUB)}
          />
        )
      case LOGIN_MODES.EMAIL_REGISTER:
        return (
          <EmailRegisterForm
            onSwitchToLogin={() => setCurrentMode(LOGIN_MODES.EMAIL_LOGIN)}
            onBackToGithub={() => setCurrentMode(LOGIN_MODES.GITHUB)}
          />
        )
      default:
        return renderGithubLogin()
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <div className={styles.topbarSelector}>
          {renderLanguages()}
        </div>
        <a href={loginLink} className={styles.topbarLink}>
          {loginText.topbarLogin}
        </a>
        <a
          rel="noopener"
          target="_blank"
          className={styles.topbarLink}
          href={`https://github.com/ecmadao/hacknical/blob/master/doc/ABOUT-${locale}.md`}
        >
          {loginText.topbarAbout}
        </a>
      </div>
      
      <div className={styles.loginPannel}>
        {renderCurrentMode()}
        
        <div className={styles.statisticContainer}>
          {renderStatistic()}
        </div>
      </div>
    </div>
  )
}

export default EnhancedLoginPanel
