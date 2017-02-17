import React, { PropTypes } from 'react';
import objectAssign from 'object-assign';
import Api from 'API';
import Tipso from 'COMPONENTS/Tipso';

import styles from '../../styles/app.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogoutTipso: false,
      showAdviceTipso: false,
      showZenTipso: false,
      zen: ''
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    this.getZen();
  }

  async getZen() {
    const zen = await Api.github.zen();
    this.setState({ zen });
  }

  onMouseEnter(key) {
    const state = objectAssign({}, this.state, {
      [key]: true
    });
    this.setState(state);
  }

  onMouseLeave(key) {
    const state = objectAssign({}, this.state, {
      [key]: false
    });
    this.setState(state);
  }

  render() {
    const {
      zen,
      showZenTipso,
      showAdviceTipso,
      showLogoutTipso
    } = this.state;
    const onMouseEnter = (key) => () => this.onMouseEnter(key);
    const onMouseLeave = (key) => () => this.onMouseLeave(key);

    return (
      <div className={styles["app_header"]}>
        <div className={styles["app_header_container"]}>
          <div className={styles["header_zen"]}>
            <span
              onMouseOver={onMouseEnter('showZenTipso')}
              onMouseEnter={onMouseEnter('showZenTipso')}
              onMouseOut={onMouseLeave('showZenTipso')}
              onMouseLeave={onMouseLeave('showZenTipso')}
              className={styles.zen}>
              {zen}
              {showZenTipso ? (
                <Tipso
                  className={styles["zen_tipso"]}
                  show={true}>
                  <span>zen of github</span>
                </Tipso>
              ) : ''}
            </span>
          </div>
          <div className={styles["header_menus"]}>
            <a
              onMouseOver={onMouseEnter('showAdviceTipso')}
              onMouseEnter={onMouseEnter('showAdviceTipso')}
              onMouseOut={onMouseLeave('showAdviceTipso')}
              onMouseLeave={onMouseLeave('showAdviceTipso')}
              href="https://github.com/ecmadao/hacknical/issues"
              target="_blank"
              className={styles["header_menu_icon_right"]}>
              <i className="fa fa-info-circle" aria-hidden="true"></i>
              {showAdviceTipso ? (
                <Tipso
                  className={styles["menu_tipso"]}
                  show={true}>
                  <span>发送反馈</span>
                </Tipso>
              ) : ''}
            </a>
            <a
              href="/user/logout"
              onMouseOver={onMouseEnter('showLogoutTipso')}
              onMouseEnter={onMouseEnter('showLogoutTipso')}
              onMouseOut={onMouseLeave('showLogoutTipso')}
              onMouseLeave={onMouseLeave('showLogoutTipso')}
              className={styles["header_menu_icon_right"]}>
              <i className="fa fa-sign-out" aria-hidden="true"></i>
              {showLogoutTipso ? (
                <Tipso
                  className={styles["menu_tipso"]}
                  show={true}>
                  <span>退出登录</span>
                </Tipso>
              ) : ''}
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
