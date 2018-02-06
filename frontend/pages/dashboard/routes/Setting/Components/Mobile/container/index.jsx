import React from 'react';
import cx from 'classnames';
import Clipboard from 'clipboard';
import { IconButton, Switcher, Input } from 'light-ui';
import objectAssign from 'UTILS/object-assign';
import Api from 'API';
import dateHelper from 'UTILS/date';
import styles from '../styles/setting.css';
import sharedStyles from 'SHARED/styles/mobile.css';
import locales from 'LOCALES';

const settingTexts = locales('dashboard').setting;

const SwitcherPane = (props) => {
  const {
    text,
    checked,
    onChange,
    disabled = false
  } = props;
  return (
    <div className={styles.itemPane}>
      <div className={styles.paneTextContainer}>
        {text}
      </div>
      <Switcher
        size="small"
        version="v3"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
    </div>
  );
};

const SettingPane = (props) => {
  const {
    title,
    children,
    sectionClassName = '',
  } = props;
  return (
    <div className={styles.paneContainer}>
      <div className={styles.paneHeader}>
        {title}
      </div>
      <div
        className={cx(
          sharedStyles.mobile_card,
          styles.settingSection,
          sectionClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

class MobileSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateTime: null,
      githubInfo: {
        loading: true,
        openShare: true,
        disabled: true,
      },
      resumeInfo: {
        loading: true,
        openShare: true,
        disabled: true,
      },
    };
    this.copyUrl = this.copyUrl.bind(this);
    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
    this.postGithubShareStatus = this.postGithubShareStatus.bind(this);
    this.postResumeShareStatus = this.postResumeShareStatus.bind(this);
  }

  componentDidMount() {
    this.renderClipboard();
    Api.github.getUpdateTime().then((result) => {
      this.setUpdateTime(result);
    });
    Api.github.getShareRecords().then((result) => {
      this.initialGithubInfo(result);
    });
    Api.resume.getPubResumeStatus().then((result) => {
      this.initialResumeInfo(result);
    });
  }

  componentWillUnmount() {
    this.githubClipboard && this.githubClipboard.destroy();
    this.resumeClipboard && this.resumeClipboard.destroy();
  }

  renderClipboard() {
    this.githubClipboard = new Clipboard('#githubCopyButton', {
      text: () => $('#githubShareUrl').val()
    });
    this.resumeClipboard = new Clipboard('#resumeCopyButton', {
      text: () => $('#resumeShareUrl').val()
    });
  }

  toggleSettingLoading(loading) {
    this.setState({ loading });
  }

  refreshGithubDatas() {
    this.toggleSettingLoading(true);
    Api.github.refresh().then((result) => {
      this.setUpdateTime(result);
    });
  }

  setUpdateTime(data) {
    const updateTime = data
      ? dateHelper.relative.secondsBefore(data)
      : this.state.updateTime;
    this.setState({
      loading: false,
      updateTime
    });
  }

  initialInfo(key) {
    const obj = this.state[key];
    return (datas) => {
      const { openShare, disabled = false } = datas;
      this.setState({
        [key]: objectAssign({}, obj, {
          loading: false,
          disabled,
          openShare,
        })
      });
    }
  }

  initialResumeInfo(result) {
    const datas = result ? {
      openShare: result.openShare,
      disabled: false,
    } : {
      openShare: false,
      disabled: true,
    };
    const initial = this.initialInfo('resumeInfo');
    initial(datas);
  }

  initialGithubInfo(datas) {
    const initial = this.initialInfo('githubInfo');
    initial(datas);
  }

  postGithubShareStatus() {
    const { githubInfo } = this.state;
    const { openShare } = githubInfo;
    Api.github.toggleShare(!openShare).then(() => {
      this.setState({
        githubInfo: {
          loading: false,
          openShare: !openShare
        }
      });
    });
  }

  postResumeShareStatus() {
    const { resumeInfo } = this.state;
    const { openShare } = resumeInfo;
    Api.resume.postPubResumeShareStatus(!openShare).then(() => {
      this.setState({
        resumeInfo: {
          loading: false,
          openShare: !openShare
        }
      });
    });
  }

  copyUrl(input) {
    document.querySelector(`#${input}`).select();
  }

  renderClipInput(inputId, buttonId, type) {
    const { login } = this.props;
    return (
      <div className={styles.itemPane}>
        <Input
          id={inputId}
          theme="flat"
          value={`${window.location.host}/${login}/${type}`}
        />
        <IconButton
          color="gray"
          icon="clipboard"
          id={buttonId}
          onClick={() => this.copyUrl(inputId)}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      updateTime,
      githubInfo,
      resumeInfo
    } = this.state;
    const { login } = this.props;

    return (
      <div className={styles.setting}>
        <SettingPane title={settingTexts.refresh}>
          <div className={styles.paneTextContainer}>
            {updateTime}<br />
            <span>
              {settingTexts.github.lastUpdate}
            </span>
          </div>
          <IconButton
            color="gray"
            icon="refresh"
            disabled={loading}
            className={styles.iconButton}
            onClick={this.refreshGithubDatas}
          />
        </SettingPane>
        <SettingPane title={settingTexts.shareConfig} sectionClassName={styles.settingRow}>
          <SwitcherPane
            text={settingTexts.github.openShare}
            onChange={this.postGithubShareStatus}
            checked={githubInfo.openShare}
            disabled={githubInfo.loading || githubInfo.disabled}
          />
          <SwitcherPane
            text={settingTexts.resume.openShare}
            onChange={this.postResumeShareStatus}
            checked={resumeInfo.openShare}
            disabled={resumeInfo.loading || resumeInfo.disabled}
          />
        </SettingPane>
        <SettingPane title={settingTexts.shareUrl} sectionClassName={styles.settingRow}>
          {this.renderClipInput('githubShareUrl', 'githubCopyButton', 'github')}
          {this.renderClipInput('resumeShareUrl', 'resumeCopyButton', 'resume')}
        </SettingPane>
      </div>
    );
  }
}

MobileSetting.defaultProps = {
  login: window.login,
};

export default MobileSetting;
