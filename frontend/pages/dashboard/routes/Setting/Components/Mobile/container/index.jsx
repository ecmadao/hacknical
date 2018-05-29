import React from 'react';
import cx from 'classnames';
import { IconButton } from 'light-ui';
import objectAssign from 'UTILS/object-assign';
import Api from 'API';
import dateHelper from 'UTILS/date';
import styles from '../styles/setting.css';
import sharedStyles from 'SHARED/styles/mobile.css';
import locales from 'LOCALES';
import HeartBeat from 'UTILS/heartbeat';
import SwitcherPanel from './SwitcherPanel';
import SettingPanel from './SettingPanel';
import InputPanel from './InputPanel';

const modalTexts = locales('shareModal');
const settingTexts = locales('dashboard').setting;


class MobileSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateTime: null,
      refreshEnable: false,
      githubInfo: {
        url: '',
        locale: '',
        loading: true,
        openShare: true,
        disabled: true,
      },
      resumeInfo: {
        url: '',
        hash: '',
        locale: '',
        loading: true,
        openShare: true,
        disabled: true,
        simplifyUrl: true,
      },
    };
    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
    this.postGithubShareStatus = this.postGithubShareStatus.bind(this);
    this.postResumeShareStatus = this.postResumeShareStatus.bind(this);
    this.toggleResumeSimplifyUrl = this.toggleResumeSimplifyUrl.bind(this);
  }

  componentDidMount() {
    Api.github.updateStatus().then((result) => {
      this.setUpdateStatus(result);
    });
    Api.github.getShareRecords().then((result) => {
      this.initialGithubInfo(result);
    });
    Api.resume.getResumeInfo().then((result) => {
      this.initialResumeInfo(result);
    });
  }

  toggleSettingLoading(loading) {
    this.setState({ loading });
  }

  refreshGithubDatas() {
    this.toggleSettingLoading(true);
    Api.github.update().then(() => {
      const heartBeat = new HeartBeat({
        interval: 3000, // 3s
        callback: () => Api.github.updateStatus().then((result) => {
          if (result && Number(result.status) === 1) {
            heartBeat.stop();
            this.setUpdateStatus(result);
          }
        })
      });
      heartBeat.takeoff();
    });
  }

  setUpdateStatus(data) {
    const {
      refreshEnable,
      lastUpdateTime
    } = data;
    const updateTime = lastUpdateTime
      ? dateHelper.relative.secondsBefore(lastUpdateTime)
      : this.state.updateTime;
    this.setState({
      updateTime,
      refreshEnable,
      loading: false,
    });
  }

  initialInfo(key) {
    const obj = this.state[key];
    return (datas) => {
      this.setState({
        [key]: objectAssign({}, obj, datas, {
          loading: false
        })
      });
    }
  }

  initialResumeInfo(result) {
    const datas = result ? {
      disabled: false,
      url: result.url,
      locale: result.locale,
      hash: result.resumeHash,
      openShare: result.openShare,
      simplifyUrl: result.simplifyUrl,
    } : {
      url: '',
      hash: '',
      locale: '',
      disabled: true,
      openShare: false,
      simplifyUrl: false,
    };
    const initial = this.initialInfo('resumeInfo');
    initial(datas);
  }

  initialGithubInfo(result) {
    const datas = result ? {
      disabled: false,
      url: result.url,
      locale: result.locale,
      openShare: result.openShare,
    } : {
      url: '',
      locale: '',
      disabled: true,
      openShare: false,
    };
    const initial = this.initialInfo('githubInfo');
    initial(datas);
  }

  postGithubShareStatus() {
    const { githubInfo } = this.state;
    const { openShare } = githubInfo;
    Api.github.toggleShare(!openShare).then(() => {
      const initial = this.initialInfo('githubInfo');
      initial({
        openShare: !openShare
      });
    });
  }

  postResumeShareStatus() {
    const { resumeInfo } = this.state;
    const { openShare } = resumeInfo;
    Api.resume.patchResumeInfo({ openShare: !openShare }).then(() => {
      const initial = this.initialInfo('resumeInfo');
      initial({
        openShare: !openShare
      });
    });
  }

  toggleResumeSimplifyUrl() {
    const { resumeInfo } = this.state;
    const { simplifyUrl } = resumeInfo;
    Api.resume.patchResumeInfo({ simplifyUrl: !simplifyUrl }).then(() => {
      const initial = this.initialInfo('resumeInfo');
      initial({
        simplifyUrl: !simplifyUrl
      });
    });
  }

  render() {
    const {
      loading,
      updateTime,
      githubInfo,
      resumeInfo,
      refreshEnable
    } = this.state;
    const { login } = this.props;

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
            onClick={this.refreshGithubDatas}
          />
        </SettingPanel>
        <SettingPanel title={settingTexts.shareConfig} sectionClassName={styles.settingRow}>
          <SwitcherPanel
            text={settingTexts.github.openShare}
            onChange={this.postGithubShareStatus}
            checked={githubInfo.openShare}
            disabled={githubInfo.loading || githubInfo.disabled}
          />
          <SwitcherPanel
            text={settingTexts.resume.openShare}
            onChange={this.postResumeShareStatus}
            checked={resumeInfo.openShare}
            disabled={resumeInfo.loading || resumeInfo.disabled}
          />
          {resumeInfo.openShare ? (
            <SwitcherPanel
              text={settingTexts.resume.simplifyUrl}
              onChange={this.toggleResumeSimplifyUrl}
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
              : `${window.location.host}/resume/${resumeInfo.hash}?locale=${locale}`
            }
          />
        </SettingPanel>
      </div>
    );
  }
}

MobileSetting.defaultProps = {
  login: window.login,
};

export default MobileSetting;
