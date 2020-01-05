import React from 'react'
import cx from 'classnames'
import { NavLink } from 'react-router-dom'
import { PortalModal } from 'light-ui'
import styles from '../../../styles/mobile.css'
import Topbar from '../../shared/Topbar'
import { TABS } from 'UTILS/constant'
import locales, { getLocale, switchLanguage } from 'LOCALES'
import MenuWrapper from '../../shared/MenuWrapper'
import Icon from 'COMPONENTS/Icon'
import LogoText from 'COMPONENTS/LogoText'

const tabs = locales('dashboard.tabs')
const locale = getLocale()

class Menus extends MenuWrapper {
  constructor(props) {
    super(props)
    this.state.menuActive = false
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  componentDidUpdate(preProps) {
    const { pathname } = this.props.location
    if (pathname !== preProps.location.pathname) {
      this.toggleMenu(false)
    }
  }

  toggleMenu(e) {
    this.setState({
      menuActive: !e ? false : !this.state.menuActive
    })
  }

  renderMenus() {
    const { login, changeActiveTab } = this.props
    return TABS.map((tab, index) => (
      <NavLink
        key={index}
        to={`/${login}/${tab.id}`}
        className={styles.menu}
        activeClassName={styles.menuActive}
        onClick={() => changeActiveTab(tab.id)}
      >
        <Icon icon={tab.icon} />
        &nbsp;&nbsp;
        {tab.name}
      </NavLink>
    ))
  }

  renderLanguageOptions() {
    const { languages } = this.state
    if (!languages || !languages.length) return null
    const languageDOMs = languages.map((language, index) => (
      <a
        key={index}
        onClick={() => switchLanguage(language.id)}
        className={styles.languageOption}
      >
        {language.text}
      </a>
    ))
    return (
      <div className={cx(styles.menu, styles.languagesWrapper)}>
        <Icon icon="language" />
        &nbsp;&nbsp;&nbsp;
        {languageDOMs}
      </div>
    )
  }

  render() {
    const { zen, menuActive } = this.state
    const aboutUrl = `https://github.com/ecmadao/hacknical/blob/master/doc/ABOUT-${locale}.md`

    return (
      <Topbar
        offsetTop={0}
        headroomClasses={{
          top: 'headroom--top-mobile',
          pinned: 'headroom--pinned-mobile'
        }}
        tabClassName={styles.menuTab}
        wrapperClassName={styles.menuBarWrapper}
        containerClassName={styles.menuBarContainer}>
        <div className={styles.menus}>
          <div className={styles.menuTopbar}>
            <div
              onClick={this.toggleMenu}
              className={styles.menuIcon}>
              <Icon icon="navicon" />
            </div>
            <div className={styles.menuLogoBar}>
              <LogoText theme="dark" />
            </div>
          </div>
          <PortalModal showModal={menuActive}>
            <div className={styles.menuContainer}>
              <div className={styles.menuTop}>
                <LogoText theme="light" className={styles.menuLogo} />
                <div
                  onClick={this.toggleMenu}
                  className={styles.menuClose}>
                  <Icon icon="close" />
                </div>
              </div>
              <div className={styles.menuZen}>{zen}</div>
              <div className={styles.menuWrapper}>
                {this.renderMenus()}
                <a href={aboutUrl} className={styles.menu}>
                  <Icon icon="external-link" />
                  &nbsp;&nbsp;
                  {tabs.about.text}
                </a>
                <div className={styles.menuBottom}>
                  {this.renderLanguageOptions()}
                  <a href="/api/user/logout" className={styles.menu}>
                    <Icon icon="sign-out" />
                    &nbsp;&nbsp;
                    {tabs.logout.text}
                  </a>
                </div>
              </div>
            </div>
          </PortalModal>
        </div>
      </Topbar>
    )
  }
}

export default Menus
