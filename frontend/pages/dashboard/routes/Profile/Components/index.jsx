import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from '../redux/actions';
import styles from '../styles/profile.css';
import locales from 'LOCALES';
import ShareAnalysis from './ShareAnalysis';

const profileTexts = locales('dashboard').profile;
const PROFILE_SECTIONS = [
  {
    id: 'resume',
    text: profileTexts.resume.title
  },
  {
    id: 'github',
    text: profileTexts.github.title
  }
];

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

  renderNavigation() {
    const { activeTab } = this.state;
    return PROFILE_SECTIONS.map((section, index) => {
      const { id, text } = section;
      const sectionClass = cx(
        styles.section,
        activeTab === id && styles.active
      );
      return (
        <div className={sectionClass} key={index}>
          <div
            className={styles["section_wrapper"]}
            onClick={() => this.changeActiveTab(id)}>
            {text}
          </div>
        </div>
      )
    });
  }

  render() {
    const { activeTab } = this.state;
    const { github, resume, actions } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.navigation}>
          {this.renderNavigation()}
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
