
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
import { ClassicButton, PortalModal } from 'light-ui'

const {
  login: loginText,
  statistic: statisticText,
  auth: authText = {}
} = locales('login')
const locale = getLocale()

const DEFAULT_NUM = 0

class LoginPanel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      statistic: {},
      languages: [],
      modalType: null,
      signupUsername: '',
      signupEmail: '',
      signupPassword: '',
      signupConfirmPassword: '',
      signupInviteCode: '',
      loginAccount: '',
      loginPassword: '',
      submitting: false,
      errorMsg: ''
    }
    this.heartBeat = null
    this.getStatistic = this.getStatistic.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.switchModal = this.switchModal.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  openModal(modalType) {
    this.setState({
      modalType,
      errorMsg: '',
      submitting: false
    })
  }

  closeModal() {
    this.setState({
      modalType: null,
      errorMsg: '',
      submitting: false
    })
  }

  switchModal(modalType) {
    this.setState({
      modalType,
      errorMsg: '',
      submitting: false
    })
  }

  handleInputChange(field, value) {
    this.setState({
      [field]: value,
      errorMsg: ''
    })
  }

  async handleSignup(e) {
    if (e && e.preventDefault) e.preventDefault()
    const {
      signupUsername,
      signupEmail,
      signupPassword,
      signupConfirmPassword,
      signupInviteCode,
      submitting
    } = this.state

    if (submitting) return

    if (!signupInviteCode || !signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      this.setState({ errorMsg: authText.errorRequired || '请完整填写各项信息' })
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      this.setState({ errorMsg: authText.errorPasswordMatch || '两次输入的密码不一致' })
      return
    }

    if (signupPassword.length < 6) {
      this.setState({ errorMsg: '密码长度至少为 6 位' })
      return
    }

    this.setState({ submitting: true, errorMsg: '' })

    try {
      const res = await API.user.signup({
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        inviteCode: signupInviteCode.trim()
      })
      if (!res) {
        this.setState({ submitting: false })
      }
    } catch (err) {
      this.setState({
        errorMsg: err.message || '注册失败，请检查填写内容',
        submitting: false
      })
    }
  }

  async handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault()
    const { loginAccount, loginPassword, submitting } = this.state

    if (submitting) return

    if (!loginAccount || !loginPassword) {
      this.setState({ errorMsg: authText.errorRequired || '请完整填写账号与密码' })
      return
    }

    this.setState({ submitting: true, errorMsg: '' })

    try {
      const res = await API.user.loginByLocal({
        account: loginAccount.trim(),
        password: loginPassword
      })
      if (!res) {
        this.setState({ submitting: false })
      }
    } catch (err) {
      this.setState({
        errorMsg: err.message || '登录失败，请检查账号密码',
        submitting: false
      })
    }
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

  renderAuthModal() {
    const {
      modalType,
      signupUsername,
      signupEmail,
      signupPassword,
      signupConfirmPassword,
      signupInviteCode,
      loginAccount,
      loginPassword,
      submitting,
      errorMsg
    } = this.state

    if (!modalType) return null

    const isSignup = modalType === 'signup'

    return (
      <PortalModal
        showModal={Boolean(modalType)}
        onClose={this.closeModal}
      >
        <div className={styles.authModalContainer}>
          <div className={styles.authTabs}>
            <div
              className={cx(styles.authTab, isSignup && styles.activeAuthTab)}
              onClick={() => this.switchModal('signup')}
            >
              {authText.signupTitle}
            </div>
            <div
              className={cx(styles.authTab, !isSignup && styles.activeAuthTab)}
              onClick={() => this.switchModal('login')}
            >
              {authText.loginTitle}
            </div>
          </div>

          {errorMsg ? (
            <div className={styles.authErrorNotice}>
              {errorMsg}
            </div>
          ) : null}

          {isSignup ? (
            <form className={styles.authForm} onSubmit={this.handleSignup}>
              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.inviteCode}</span>
                <input
                  type="text"
                  className={styles.authInput}
                  placeholder={authText.inviteCode}
                  value={signupInviteCode}
                  onChange={e => this.handleInputChange('signupInviteCode', e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.username}</span>
                <input
                  type="text"
                  className={styles.authInput}
                  placeholder={authText.username}
                  value={signupUsername}
                  onChange={e => this.handleInputChange('signupUsername', e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.email}</span>
                <input
                  type="email"
                  className={styles.authInput}
                  placeholder={authText.email}
                  value={signupEmail}
                  onChange={e => this.handleInputChange('signupEmail', e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.password}</span>
                <input
                  type="password"
                  className={styles.authInput}
                  placeholder={authText.password}
                  value={signupPassword}
                  onChange={e => this.handleInputChange('signupPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.confirmPassword}</span>
                <input
                  type="password"
                  className={styles.authInput}
                  placeholder={authText.confirmPassword}
                  value={signupConfirmPassword}
                  onChange={e => this.handleInputChange('signupConfirmPassword', e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.authSubmitBtn}
              >
                {submitting ? '...' : authText.signupSubmit}
              </button>

              <div
                className={styles.authSwitchLink}
                onClick={() => this.switchModal('login')}
              >
                {authText.switchToLogin}
              </div>
            </form>
          ) : (
            <form className={styles.authForm} onSubmit={this.handleLogin}>
              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.account}</span>
                <input
                  type="text"
                  className={styles.authInput}
                  placeholder={authText.account}
                  value={loginAccount}
                  onChange={e => this.handleInputChange('loginAccount', e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className={styles.authField}>
                <span className={styles.authLabel}>{authText.password}</span>
                <input
                  type="password"
                  className={styles.authInput}
                  placeholder={authText.password}
                  value={loginPassword}
                  onChange={e => this.handleInputChange('loginPassword', e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.authSubmitBtn}
              >
                {submitting ? '...' : authText.loginSubmit}
              </button>

              <div
                className={styles.authSwitchLink}
                onClick={() => this.switchModal('signup')}
              >
                {authText.switchToSignup}
              </div>
            </form>
          )}
        </div>
      </PortalModal>
    )
  }

  render() {
    const { loginLink } = this.props

    return (
      <div>
        <div className={styles.topbar}>
          <div className={styles.topbarSelector}>
            {this.renderLanguages()}
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
          <LogoText theme="light" className={styles.logo} />
          <div className={styles.loginButtonGroup}>
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
            <div
              className={styles.subActionBtn}
              onClick={() => this.openModal('login')}
            >
              {authText.localLoginButton}
            </div>
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
        {this.renderAuthModal()}
      </div>
    )
  }
}

export default LoginPanel
