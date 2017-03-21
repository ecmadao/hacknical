import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/actions';
import styles from '../styles/profile.css';
import locales from 'LOCALES';

const profileTexts = locales('dashboard').profile;

import ShareAnalysis from './ShareAnalysis';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "resume"
    };
    this.changeActiveTab = this.changeActiveTab.bind(this);
  }

  changeActiveTab(activeTab) {
    this.setState({ activeTab });
  }

  render() {
    const { activeTab } = this.state;
    const { github, resume, actions } = this.props;

    return (
      <div>
        <div className={styles["head_switchers"]}>
          <div
            onClick={() => this.changeActiveTab("resume")}
            className={cx(
              styles["head_switcher"],
              activeTab === "resume" && styles["head_switcher_active"]
            )}><i aria-hidden="true" className="fa fa-file-code-o"></i>&nbsp;&nbsp;{profileTexts.resume.title}</div>
          &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
          <div
            onClick={() => this.changeActiveTab("github")}
            className={cx(
              styles["head_switcher"],
              activeTab !== "resume" && styles["head_switcher_active"]
            )}><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;{profileTexts.github.title}</div>
        </div>
        {activeTab === "resume" ? (
          <ShareAnalysis
            actions={{
              fetchShareData: actions.fetchResumeShareData,
            }}
            index={0}
            key={0}
            text={profileTexts.resume.shareText}
            {...resume}
          />
        ) : (
          <ShareAnalysis
            actions={{
              fetchShareData: actions.fetchGithubShareData,
            }}
            index={1}
            key={1}
            text={profileTexts.github.shareText}
            {...github}
          />
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.profile}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
