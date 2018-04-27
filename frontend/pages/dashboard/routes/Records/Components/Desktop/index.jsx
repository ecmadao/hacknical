import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import recordsActions from '../../redux/actions';
import styles from '../../styles/records.css';
import locales from 'LOCALES';
import ShareRecords from './ShareRecords';
import { RECORDS_SECTIONS } from '../../shared/data';

const recordsTexts = locales('dashboard').records;

class Records extends React.Component {
  renderNavigation() {
    const { activeTab, actions } = this.props;
    return Object.keys(RECORDS_SECTIONS).map((key, index) => {
      const { ID, TEXT } = RECORDS_SECTIONS[key];
      const sectionClass = cx(
        styles.section,
        activeTab === ID && styles.active
      );
      return (
        <div className={sectionClass} key={index}>
          <div
            className={styles.section_wrapper}
            onClick={() => actions.onAnalysisDataTabChange(ID)}
          >
            {TEXT}
          </div>
        </div>
      );
    });
  }

  get actions() {
    const { actions, activeTab } = this.props;
    const sectionActions = {
      [RECORDS_SECTIONS.RESUME.ID]: {
        fetchShareData: actions.fetchResumeShareData,
      },
      [RECORDS_SECTIONS.GITHUB.ID]: {
        fetchShareData: actions.fetchGithubShareData,
      },
    };
    return {
      ...sectionActions[activeTab],
      onViewTypeChange: actions.onPageViewTypeChange,
    };
  }

  get analysisProps() {
    const { activeTab } = this.props;
    return {
      ...this.props[activeTab],
      text: recordsTexts[activeTab].shareText,
    };
  }

  render() {
    const { activeTab } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.navigation}>
          {this.renderNavigation()}
        </div>
        <ShareRecords
          actions={this.actions}
          index={activeTab}
          {...this.analysisProps}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.records
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(recordsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Records);
