import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Headroom from 'headroom.js';
import { Link } from 'react-router';
import AppAction from '../../redux/actions';
import { TABS } from '../../shared/data';

/**
 * TODO: Add animation
 */

class TabBar extends React.Component {
  constructor(props) {
    super(props);
    this.changeActiveTab = this.changeActiveTab.bind(this);
  }

  componentDidMount() {
    Headroom.options.offset = 50;
    const headroom = new Headroom(this.headroom);
    headroom.init();
  }

  changeActiveTab(e, id, enable) {
    const { changeActiveTab } = this.props;
    if (!enable) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    changeActiveTab && changeActiveTab(id);
  }

  renderTab() {
    const { changeActiveTab, activeTab } = this.props;

    return TABS.map((tab, index) => {
      const { id, name, icon, enable } = tab;
      const style = activeTab === id ? (tab.activeStyle || {}) : {};
      const tabClass = cx(
        "app_tab",
        enable && "enable"
      );
      return (
        <Link
          key={index}
          to={`/${id}`}
          style={style}
          className={tabClass}
          activeClassName="app_tab_active"
          onClick={(e) => this.changeActiveTab(e, id, enable)}>
          <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
          {name}
        </Link>
      )
    })
  }

  render() {
    return (
      <div className="app_tabs" ref={ref => this.headroom = ref}>
        <div className="app_tabs_container">
          {this.renderTab()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { tabBarActive, activeTab } = state.app;
  return {
    tabBarActive,
    activeTab
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (tab) => {
      dispatch(AppAction.changeTab(tab));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
