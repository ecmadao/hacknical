/* eslint no-alert: "off" */
import React from 'react'
import { connect } from 'react-redux'
import { TABS } from 'UTILS/constant'
import Tab from './Tab'
import locales from 'LOCALES'
import Topbar from '../../shared/Topbar'

const resumeTexts = locales('resume')

class TabBar extends React.Component {
  constructor(props) {
    super(props)
    this.changeActiveTab = this.changeActiveTab.bind(this)
  }

  changeActiveTab(e, id, enable) {
    const { changeActiveTab, edited } = this.props
    if ((edited && !window.confirm(resumeTexts.editedConfirm)) || !enable) {
      e.stopPropagation()
      e.preventDefault()
      return false
    }
    changeActiveTab && changeActiveTab(id)
  }

  renderTab() {
    const { activeTab, login } = this.props

    return TABS.map((tab, index) => (
      <Tab
        tab={tab}
        key={index}
        login={login}
        active={activeTab === tab.id}
        onChange={this.changeActiveTab}
      />
    ))
  }

  render() {
    return (
      <Topbar headroomClasses={{ top: 'headroom--top-desktop' }}>
        {this.renderTab()}
      </Topbar>
    )
  }
}

function mapStateToProps(state) {
  const { resume } = state
  return {
    edited: resume && resume.edited
  }
}

export default connect(mapStateToProps)(TabBar)
