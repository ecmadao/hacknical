
import React from 'react'
import cx from 'classnames'
import LogoText from 'COMPONENTS/LogoText'
import Icon from 'COMPONENTS/Icon'
import styles from './footer.css'
import locales, { getLocale } from 'LOCALES'
import { REMOTE_ASSETS } from 'UTILS/constant'

const footerText = locales('datas.footer')
const locale = getLocale()

class Footer extends React.Component {
  render() {
    const { isMobile } = this.props
    return (
      <div className={cx(styles.footer, styles[`footer-${ locale }`])}>
        <div className={styles.footerWrapper}>
          <div className={styles.footerLeft}>
            <img className={styles.footerImage} src={REMOTE_ASSETS.LOGO_ICON} />
            &nbsp;&nbsp;
            <LogoText theme="dark" className={styles.footerLogo}/>
          </div>

          <div className={styles.footerRight}>
            {!isMobile && (
              <span className={styles.footerIntro}>
                <Icon icon="code" /> by <a href="https://github.com/ecmadao" target="_blank">ecmadao</a> with <Icon icon="heart" />
              </span>
            )}
            <a rel="noopener" href={`https://github.com/ecmadao/hacknical/blob/master/doc/ABOUT-${locale}.md`} target="_blank">
              {footerText.about}
            </a>
            &nbsp;&nbsp;
            {!isMobile && [
              (
                <a
                  rel="noopener"
                  key="footer-1"
                  target="_blank"
                  className={styles.footerLink}
                  href="https://github.com/ecmadao/hacknical/issues"
                >
                  {footerText.feedback}
                </a>
              ),
              (
                <a
                  rel="noopener"
                  key="footer-2"
                  target="_blank"
                  className={styles.footerLink}
                  href="https://github.com/ecmadao/hacknical"
                >
                  {footerText.code}
                </a>
              ),
              (
                <a
                  rel="noopener"
                  key="footer-3"
                  target="_blank"
                  className={styles.footerLink}
                  href="http://www.beian.miit.gov.cn"
                >
                  {footerText.gov}
                </a>
              )
            ]}
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
