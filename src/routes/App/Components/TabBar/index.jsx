import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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
    const {changeActiveTab} = this.props;
    return TABS.map((tab, index) => {
      const {id, name, icon} = tab;
      return (
        <div
          key={index}
          className="app_tab"
          onClick={() => {
            changeActiveTab && changeActiveTab(id);
          }}>
          <Link to={`/${id}`} activeClassName="app_tab_active">
            <i aria-hidden="true" className={`fa ${icon}`}></i>&nbsp;
            {name}
          </Link>
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
