import React, { PropTypes } from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className="app_header">
        <div className="app_header_container">
          <div className="header_menu_icon">
            <i className="fa fa-navicon" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
