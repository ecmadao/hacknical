import React from 'react';
import { Tipso } from 'light-ui';

import Api from 'API';
import locales from 'LOCALES';
import languages from 'LANGUAGES';
import styles from '../../styles/app.css';

const headers = locales('dashboard').headers;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zen: ''
    };
  }

  componentDidMount() {
    this.getZen();
  }

  async getZen() {
    const zen = await Api.github.zen();
    this.setState({ zen });
  }

  renderLanguageOptions(options) {
    const optionDOMs = options.map((option, index) => (
      <a
        key={index}
        href={`/?locale=${option.id}`}
        className={styles.dropdown_item}
      >
        {option.text}
      </a>
    ));
    return (
      <div className={styles.dropdown_wrapper}>
        {optionDOMs}
      </div>
    );
  }

  render() {
    const { zen } = this.state;
    const locale = window.locale || 'en';
    const languageOptions = languages(locale);

    return (
      <div className={styles.app_header}>
        <div className={styles.app_header_container}>
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
            {this.renderLanguageOptions(languageOptions)}
            <Tipso
              theme="dark"
              position="bottom"
              className={styles.menu_tipso}
              tipsoContent={(<span>{headers.about}</span>)}
            >
              <div className={styles.headerMenuWrapper}>
                <a
                  href={`https://github.com/ecmadao/hacknical/blob/master/doc/ABOUT-${locale || 'en'}.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.header_menu_icon_right}
                >
                  <i className="fa fa-question-circle" aria-hidden="true" />
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
                  href="https://github.com/ecmadao/hacknical/issues"
                >
                  <i className="fa fa-info-circle" aria-hidden="true" />
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
                  href="/user/logout"
                  className={styles.header_menu_icon_right}
                >
                  <i className="fa fa-sign-out" aria-hidden="true" />
                </a>
              </div>
            </Tipso>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
