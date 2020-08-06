import React from 'react'
import { Tipso } from 'light-ui'
import locales, { getLocale, switchLanguage } from 'LOCALES'
import styles from '../../../styles/desktop.css'
import MenuWrapper from '../../shared/MenuWrapper'
import { URLS } from 'UTILS/constant/github'
import Icon from 'COMPONENTS/Icon'
import LogoText from 'COMPONENTS/LogoText'

const { headers } = locales('dashboard')
const locale = getLocale()

class Header extends MenuWrapper {
  renderLanguageOptions() {
    const { languages } = this.state
    if (!languages.length) return null

    const optionDOMs = languages.map((option, index) => (
      <a
        key={index}
        onClick={() => switchLanguage(option.id)}
        className={styles.dropdown_item}
      >
        {option.text}
      </a>
    ))
    return (
      <div className={styles.dropdown_wrapper}>
        {optionDOMs}
      </div>
    )
  }

  render() {
    const { zen } = this.state

    return (
      <div className={styles.app_header}>
        <div className={styles.app_header_container}>
          <div className={styles.header_logo}>
            <LogoText theme="dark" />
          </div>
          <div className={styles.header_zen}>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles.zen_tipso}
              tipsoContent={(<span>{headers.zen}</span>)}
            >
              <span className={styles.zen}>
                {zen}
              </span>
            </Tipso>
          </div>
          <div className={styles.header_menus}>
            {this.renderLanguageOptions()}
            <Tipso
              theme="dark"
              position="bottom"
              className={styles.menu_tipso}
              tipsoContent={(<span>{headers.about}</span>)}
            >
              <div className={styles.headerMenuWrapper}>
                <a
                  href={`${URLS.REPOSITORY}/blob/master/doc/ABOUT-${locale || 'en'}.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.header_menu_icon_right}
                >
                  <Icon icon="question-circle" />
                </a>
              </div>
            </Tipso>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles.menu_tipso}
              tipsoContent={(<span>{headers.feedback}</span>)}
            >
              <div className={styles.headerMenuWrapper}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.header_menu_icon_right}
                  href={`${URLS.ISSUE}/new`}
                >
                  <Icon icon="info-circle" />
                </a>
              </div>
            </Tipso>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles.menu_tipso}
              tipsoContent={(<span>{headers.logout}</span>)}
            >
              <div className={styles.headerMenuWrapper}>
                <a
                  href="/api/user/logout"
                  className={styles.header_menu_icon_right}
                >
                  <Icon icon="sign-out" />
                </a>
              </div>
            </Tipso>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
