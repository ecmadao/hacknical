import React, { PropTypes } from 'react';
import styles from '../../styles/app.css';

class Header extends React.Component {
  render() {
    return (
      <div className={styles["app_header"]}>
        <div className={styles["app_header_container"]}>
          {/* <div className="header_menu_icon">
            <i className="fa fa-navicon" aria-hidden="true"></i>
          </div> */}
          <div className={styles["header_menus"]}>
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
