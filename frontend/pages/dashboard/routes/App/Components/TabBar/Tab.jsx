import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import appStyles from '../../styles/app.css';
import Tipso from 'COMPONENTS/Tipso';

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTipso: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onMouseEnter() {
    this.setState({ showTipso: true });
  }

  onMouseOut() {
    this.setState({ showTipso: false });
  }

  render() {
    const { showTipso } = this.state;
    const { onChange, style, tab } = this.props;
    const { id, name, icon, enable } = tab;
    const tabClass = cx(
      "app_tab",
      enable && "enable"
    );
    return (
      <Link
        to={`/${id}`}
        style={style}
        className={tabClass}
        activeClassName="app_tab_active"
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseOut}
        onMouseEnter={this.onMouseEnter}
        onMouseOut={this.onMouseOut}
        onClick={(e) => onChange(e, id, enable)}>
        <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
        {name}
        {!enable && showTipso ? (
          <Tipso
            style={appStyles["tipso"]}
            show={true}>
            <span>功能暂未开放</span>
          </Tipso>
        ) : ''}
      </Link>
    )
  }
}

export default Tab;
