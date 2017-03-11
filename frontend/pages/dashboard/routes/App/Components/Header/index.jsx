import React, { PropTypes } from 'react';
import objectAssign from 'object-assign';
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
    const optionDOMs = options.map((option, index) => {
      return (
        <a
          key={index}
          href={`/?locale=${option.id}`}
          className={styles["dropdown_item"]}>
          {option.text}
        </a>
      )
    });
    return (
      <div className={styles["dropdown_wrapper"]}>
        {optionDOMs}
      </div>
    )
  }

  render() {
    const { zen } = this.state;
    const locale = window.locale || 'en';
    const languageOptions = languages(locale);

    return (
      <div className={styles["app_header"]}>
        <div className={styles["app_header_container"]}>
          <div className={styles["header_zen"]}>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles["zen_tipso"]}
              tipsoContent={(<span>{headers.zen}</span>)}>
              <span
                className={styles.zen}>
                {zen}
              </span>
            </Tipso>
          </div>
          <div className={styles["header_menus"]}>
            {this.renderLanguageOptions(languageOptions)}
            <Tipso
              theme="dark"
              position="bottom"
              className={styles["menu_tipso"]}
              tipsoContent={(<span>{headers.about}</span>)}>
              <a
                href={`https://github.com/ecmadao/hacknical/blob/master/doc/ABOUT-${locale || 'en'}.md`}
                target="_blank"
                className={styles["header_menu_icon_right"]}>
                <i className="fa fa-question-circle" aria-hidden="true"></i>
              </a>
            </Tipso>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles["menu_tipso"]}
              tipsoContent={(<span>{headers.feedback}</span>)}>
              <a
                href="https://github.com/ecmadao/hacknical/issues"
                target="_blank"
                className={styles["header_menu_icon_right"]}>
                <i className="fa fa-info-circle" aria-hidden="true"></i>
              </a>
            </Tipso>
            <Tipso
              theme="dark"
              position="bottom"
              className={styles["menu_tipso"]}
              tipsoContent={(<span>{headers.logout}</span>)}>
              <a
                href="/user/logout"
                className={styles["header_menu_icon_right"]}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </a>
            </Tipso>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
