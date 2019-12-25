
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AnimationComponent } from 'light-ui'
import recordsActions from '../../../redux/actions'
import styles from '../styles/records.css'
import locales from 'LOCALES'
import ShareRecords from './ShareRecords'
import { RECORDS_SECTIONS } from 'UTILS/constant/records'
import Navigation from 'COMPONENTS/Navigation'

const recordsTexts = locales('dashboard').records
const sections = Object.keys(RECORDS_SECTIONS).map(key => ({
  id: RECORDS_SECTIONS[key].ID,
  text: RECORDS_SECTIONS[key].TEXT
}))

class DesktopRecords extends React.Component {
  get actions() {
    const { actions, activeTab } = this.props
    const {
      logsLoading,
      recordsLoading,
      recordsFetched,
      logsFetched
    } = this.props[activeTab]
    return {
      fetchShareData: () => {
        if (!recordsLoading && !recordsFetched) actions.fetchRecordsData(activeTab)
        if (!logsLoading && !logsFetched) actions.fetchLogsData(activeTab)
      },
      onViewTypeChange: actions.onPageViewTypeChange
    }
  }

  get analysisProps() {
    const { activeTab } = this.props
    return {
      ...this.props[activeTab],
      text: recordsTexts[activeTab.toLowerCase()].shareText
    }
  }

  render() {
    const { activeTab, actions } = this.props

    return (
      <div className={styles.container}>
        <Navigation
          sections={sections}
          activeSection={activeTab}
          handleSectionChange={actions.onTabChange}
        />
        <AnimationComponent>
          <ShareRecords
            actions={this.actions}
            index={activeTab}
            {...this.analysisProps}
          />
        </AnimationComponent>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { ...state.records }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(recordsActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DesktopRecords)
