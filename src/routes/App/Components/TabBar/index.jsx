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

class TabBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTab() {
    const {changeActiveTab, activeTab} = this.props;
    return TABS.map((tab, index) => {
      const {id, name, icon} = tab;
      return (
        <div
          key={index}
          className={`app_tab ${id === activeTab && 'active'}`}
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
      <div className="tab">
        {this.renderTab()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {tabBarActive, activeTab} = state;
  return {
    tabBarActive,
    activeTab
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (tab) => {
      dispatch(AppAction.changeActiveTab(tab));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
