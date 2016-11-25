import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppAction from '../../redux/actions';

const TABS = [
  {
    id: 'profile',
    name: '用户信息',
    icon: 'fa-user-circle'
  },
  {
    id: 'resume',
    name: '简历',
    icon: 'fa-file-text-o'
  },
  {
    id: 'github',
    name: 'github',
    icon: 'fa-github'
  },
  {
    id: 'setting',
    name: '设置',
    icon: 'fa-cog'
  }
];

/**
 * TODO: Add animation
 */

class TabBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTab() {
    const {changeActiveTab, activeTab} = this.props;
    return TABS.map((tab, index) => {
      const {id, name, icon} = tab;
      const tabClass = id === activeTab ? 'app_tab active' : 'app_tab';
      return (
        <div
          key={index}
          className={tabClass}
          onClick={() => {
            changeActiveTab && changeActiveTab(id);
          }}>
          <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
          {name}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="app_tabs">
        <div className="app_tabs_container">
          {this.renderTab()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {tabBarActive, activeTab} = state.app;
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
