
import React from 'react'
import cx from 'classnames'
import API from 'API'
import Icon from 'COMPONENTS/Icon'
import HeartBeat from 'UTILS/heartbeat'
import styles from '../styles/login.css'
import locales, { getLocale } from 'LOCALES'
import { formatNumber } from 'UTILS/formatter'
import CountByStep from 'COMPONENTS/Count/CountByStep'
import LogoText from 'COMPONENTS/LogoText'
import Terminal from 'COMPONENTS/Terminal'
import { ClassicButton } from 'light-ui'
import EmailLoginForm from '../components/EmailLoginForm'
import EmailRegisterForm from '../components/EmailRegisterForm'

const {
  login: loginText,
  statistic: statisticText,
  emailAuth: emailText
} = locales('login')
const locale = getLocale()

const DEFAULT_NUM = 0
const LOGIN_MODES = {
  GITHUB: 'github',
  EMAIL_LOGIN: 'email_login',
  EMAIL_REGISTER: 'email_register'
}

class LoginPanel extends React.PureComponent {
  constructor(props) {
    super(props)
    
    // Determine initial login mode based on current URL
    const currentPath = window.location.pathname
    let initialMode = LOGIN_MODES.GITHUB  // Default to GitHub login to show all options
    if (currentPath === '/signup') {
      initialMode = LOGIN_MODES.EMAIL_REGISTER
    } else if (currentPath === '/login') {
      initialMode = LOGIN_MODES.EMAIL_LOGIN
    }
    
    this.state = {
      loading: true,
      statistic: {},
      languages: [],
      loginMode: initialMode
    }
    this.heartBeat = null
    this.getStatistic = this.getStatistic.bind(this)
  }

  componentDidMount() {
    this.getLanguages()
    this.heartBeat = new HeartBeat({
      interval: 1000 * 60 * 2, // 2 min
      callback: () => this.getStatistic()
    })
    this.heartBeat.takeoff()
  }

  componentWillUnmount() {
    this.heartBeat.stop()
  }

  async getLanguages() {
    const languages = await API.home.languages()
    this.setState({ languages: languages || [] })
  }

  async getStatistic() {
    const statistic = await API.home.statistic()
    const {
      users,
      github = {},
      resume = {}
    } = (statistic || {})

    const usersCount = Number(users || DEFAULT_NUM)
    const githubPageview = (github && github.pageview) || DEFAULT_NUM
    const resumePageview = (resume && resume.pageview) || DEFAULT_NUM
    const resumeCount = (resume && resume.count) || DEFAULT_NUM
    const resumeDownload = (resume && resume.download) || DEFAULT_NUM

    const resumeNum = Number(resumeCount) + Number(resumeDownload)

    this.setState({
      statistic: {
        usersCount,
        githubPageview,
        resumePageview,
        resumeNum
      },
      loading: false
    })
  }

  switchLoginMode = (mode) => {
    this.setState({ loginMode: mode })
  }

  renderModal() {
    const { isMobile } = this.props
    const { loading, statistic } = this.state
    if (loading) return null

    const {
      usersCount,
      githubPageview,
      resumePageview,
      resumeNum
    } = statistic

    return (
      <div className={cx(styles.statisticModal, isMobile && styles.statisticModalBottom)}>
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

  renderLoading() {
    const { loading } = this.state
    if (!loading) return null
    return (
      <div className={styles.statisticLoading}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }

  renderStatistic() {
    const { loading, statistic } = this.state
    if (loading) return null

    const {
      usersCount,
      githubPageview,
      resumePageview,
      resumeNum
    } = statistic

    return (
      <div className={styles.statistic}>
        <CountByStep
          start={0}
          end={usersCount}
          duration={3500}
          render={
            num => (
              <span className={styles.statisticCount}>{formatNumber(num)}</span>
            )
          }
        />
        <span>·</span>
        <CountByStep
          start={0}
          end={Number(githubPageview) + Number(resumePageview)}
          duration={3500}
          render={
            num => (
              <span className={styles.statisticCount}>{formatNumber(num)}</span>
            )
          }
        />
        <span>·</span>
        <CountByStep
          start={0}
          end={resumeNum}
          duration={3500}
          render={
            num => (
              <span className={styles.statisticCount}>{formatNumber(num)}</span>
            )
          }
        />
      </div>
    )
  }

  renderLanguages() {
    const { languages } = this.state
    return languages.map((language, index) => {
      return (
        <a href={`/?locale=${language.id}`} key={index} className={styles.topbarLink}>
          {language.text}
        </a>
      )
    })
  }

  renderMainContent() {
    const { loginLink } = this.props
    const { loginMode } = this.state

    switch (loginMode) {
      case LOGIN_MODES.EMAIL_LOGIN:
        return (
          <EmailLoginForm
            onSwitchToRegister={() => this.switchLoginMode(LOGIN_MODES.EMAIL_REGISTER)}
            onBackToGithub={() => this.switchLoginMode(LOGIN_MODES.GITHUB)}
          />
        )
      case LOGIN_MODES.EMAIL_REGISTER:
        return (
          <EmailRegisterForm
            onSwitchToLogin={() => this.switchLoginMode(LOGIN_MODES.EMAIL_LOGIN)}
            onBackToGithub={() => this.switchLoginMode(LOGIN_MODES.GITHUB)}
          />
        )
      default:
        return (
          <div className={styles.githubLoginContainer}>
            <LogoText theme="light" className={styles.logo} />
            
            <div className={styles.loginButtonsContainer}>
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

              <ClassicButton
                theme="light"
                onClick={() => this.switchLoginMode(LOGIN_MODES.EMAIL_LOGIN)}
                buttonContainerClassName={styles.emailLoginButton}
              >
                <span className={styles.emailLoginLink}>
                  <Icon icon="envelope" />
                  &nbsp;
                  {emailText.loginTitle}
                </span>
              </ClassicButton>
            </div>
     
            <Terminal
              className={styles.loginIntro}
              wordLines={[`$ ${loginText.loginText}`]}
            />
            <div className={styles.statisticContainer}>
              {this.renderLoading()}
              {this.renderStatistic()}
              {this.renderModal()}
            </div>
          </div>
        )
    }
  }

  render() {
    return (
      <div>
        <div className={styles.topbar}>
          <div className={styles.topbarSelector}>
            {this.renderLanguages()}
          </div>
          <a href="/login" className={styles.topbarLink}>
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
          {this.renderMainContent()}
        </div>
      </div>
    )
  }
}

export default LoginPanel
