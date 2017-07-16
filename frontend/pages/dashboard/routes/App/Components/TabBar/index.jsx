import React from 'react';
import { connect } from 'react-redux';
import Headroom from 'headroom.js';
import AppAction from '../../redux/actions';
import TABS from 'SRC/data/tab';
import Tab from './Tab';
import locales from 'LOCALES';

const resumeTexts = locales('resume');

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
    const { changeActiveTab, edited } = this.props;
    if ((edited && !window.confirm(resumeTexts.editedConfirm)) || !enable) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    changeActiveTab && changeActiveTab(id);
  }

  renderTab() {
    const { activeTab } = this.props;

    return TABS.map((tab, index) => (
      <Tab
        key={index}
        tab={tab}
        active={activeTab === tab.id}
        onChange={this.changeActiveTab}
      />
    ));
  }

  render() {
    return (
      <div className="app_tabs" ref={ref => (this.headroom = ref)}>
        <div className="app_tabs_container">
          {this.renderTab()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { tabBarActive, activeTab } = state.app;
  const { resume } = state;
  return {
    tabBarActive,
    activeTab,
    edited: resume && resume.edited
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeActiveTab: (tab) => {
      dispatch(AppAction.changeTab(tab));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);
