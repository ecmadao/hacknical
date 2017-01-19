import React, { PropTypes } from 'react';
import Tipso from 'COMPONENTS/Tipso';

import styles from '../../styles/app.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTipso: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({ showTipso: true });
  }

  onMouseLeave() {
    this.setState({ showTipso: false });
  }

  render() {
    const { showTipso } = this.state;
    return (
      <div className={styles["app_header"]}>
        <div className={styles["app_header_container"]}>
          {/* <div className="header_menu_icon">
            <i className="fa fa-navicon" aria-hidden="true"></i>
          </div> */}
          <div className={styles["header_menus"]}>
            <a
              onMouseOver={this.onMouseEnter}
              onMouseEnter={this.onMouseEnter}
              onMouseOut={this.onMouseLeave}
              onMouseLeave={this.onMouseLeave}
              href="mailto:wlec@outlook.com?subject=Hacknical反馈"
              className={styles["header_menu_icon_right"]}>
              {showTipso ? (
                <Tipso
                  className={styles["menu_tipso"]}
                  show={true}>
                  <span>发送反馈</span>
                </Tipso>
              ) : ''}
              <i className="fa fa-envelope-o" aria-hidden="true"></i>
            </a>
            <a
              href="/user/logout"
              className={styles["header_menu_icon_right"]}>
              <i className="fa fa-sign-out" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
