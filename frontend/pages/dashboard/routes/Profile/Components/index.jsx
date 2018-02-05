import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import profileActions from '../redux/actions';
import styles from '../styles/profile.css';
import locales from 'LOCALES';
import ShareAnalysis from './ShareAnalysis';
import { PROFILE_SECTIONS } from '../shared/data';

const profileTexts = locales('dashboard').profile;

class Profile extends React.Component {
  renderNavigation() {
    const { activeTab, actions } = this.props;
    return Object.keys(PROFILE_SECTIONS).map((key, index) => {
      const { ID, TEXT } = PROFILE_SECTIONS[key];
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
      [PROFILE_SECTIONS.RESUME.ID]: {
        fetchShareData: actions.fetchResumeShareData,
      },
      [PROFILE_SECTIONS.GITHUB.ID]: {
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
      text: profileTexts[activeTab].shareText,
    };
  }

  render() {
    const { activeTab } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.navigation}>
          {this.renderNavigation()}
        </div>
        <ShareAnalysis
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
    ...state.profile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(profileActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
