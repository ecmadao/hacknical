import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconButton } from 'light-ui';
import styles from '../styles/setting.css';
import locales from 'LOCALES';
import SwitcherPanel from './SwitcherPanel';
import SettingPanel from './SettingPanel';
import InputPanel from './InputPanel';
import settingActions from '../../../redux/actions';

const settingTexts = locales('dashboard').setting;

class MobileSetting extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchGithubUpdateStatus();
    actions.fetchResumeShareInfo();
    actions.fetchGithubShareInfo();
  }

  render() {
    const {
      login,
      actions,
      loading,
      updateTime,
      githubInfo,
      resumeInfo,
      refreshEnable
    } = this.props;

    return (
      <div className={styles.setting}>
        <SettingPanel title={settingTexts.refresh}>
          <div className={styles.paneTextContainer}>
            {updateTime}<br />
            <span>
              {settingTexts.github.lastUpdate}
            </span>
          </div>
          <IconButton
            color="gray"
            icon="refresh"
            disabled={loading || !refreshEnable}
            className={styles.iconButton}
            onClick={actions.refreshGithubDatas}
          />
        </SettingPanel>
        <SettingPanel title={settingTexts.shareConfig} sectionClassName={styles.settingRow}>
          <SwitcherPanel
            text={settingTexts.github.openShare}
            onChange={actions.postGithubShareStatus}
            checked={githubInfo.openShare}
            disabled={githubInfo.loading || githubInfo.disabled}
          />
          <SwitcherPanel
            text={settingTexts.resume.openShare}
            onChange={actions.postResumeShareStatus}
            checked={resumeInfo.openShare}
            disabled={resumeInfo.loading || resumeInfo.disabled}
          />
          {resumeInfo.openShare ? (
            <SwitcherPanel
              text={settingTexts.resume.simplifyUrl}
              onChange={actions.toggleResumeSimplifyUrl}
              checked={resumeInfo.simplifyUrl}
              disabled={resumeInfo.loading || resumeInfo.disabled}
            />
          ) : null}
        </SettingPanel>
        <SettingPanel title={settingTexts.shareUrl} sectionClassName={styles.settingRow}>
          <InputPanel
            inputId="githubShareUrl"
            buttonId="githubCopyButton"
            disabled={!githubInfo.openShare}
            url={`${window.location.host}/${githubInfo.url}`}
          />
          <InputPanel
            inputId="resumeShareUrl"
            buttonId="resumeCopyButton"
            disabled={!resumeInfo.openShare}
            url={
              resumeInfo.simplifyUrl
              ? `${window.location.host}/${login}/resume?locale=${locale}`
              : `${window.location.host}/resume/${resumeInfo.resumeHash}?locale=${locale}`
            }
          />
        </SettingPanel>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return { ...state.setting };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(settingActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileSetting);

