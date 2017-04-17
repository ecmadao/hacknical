import React from 'react';
import cx from 'classnames';
import objectAssign from 'object-assign';
import { IconButton, Switcher } from 'light-ui';

import Api from 'API/index';
import dateHelper from 'UTILS/date';
import styles from '../styles/setting.css';
import sharedStyles from '../../shared/styles/mobile.css';
import locales from 'LOCALES';

const settingTexts = locales('dashboard').setting;
const paneStyle = cx(sharedStyles["mobile_card"], styles["setting_section"]);

const SwitcherPane = (props) => {
  const { onChange, checked, text, disabled } = props;
  return (
    <div className={paneStyle}>
      <div className={styles["pane_text_container"]}>
        {text}
      </div>
      <Switcher
        size="small"
        version="v2"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
      />
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
        openShare: true
      },
      resumeInfo: {
        loading: true,
        openShare: true
      }
    };

    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
    this.postGithubShareStatus = this.postGithubShareStatus.bind(this);
    this.postResumeShareStatus = this.postResumeShareStatus.bind(this);
  }

  componentDidMount() {
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
      const { openShare } = datas;
      this.setState({
        [key]: objectAssign({}, obj, {
          loading: false,
          openShare
        })
      });
    }
  }

  initialResumeInfo(datas) {
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
    Api.github.toggleShare(!openShare).then((result) => {
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
    Api.resume.postPubResumeShareStatus(!openShare).then((result) => {
      this.setState({
        resumeInfo: {
          loading: false,
          openShare: !openShare
        }
      });
    });
  }

  render() {
    const { loading, updateTime, githubInfo, resumeInfo } = this.state;

    return (
      <div className={styles["setting"]}>
        <div className={paneStyle}>
          <div className={styles["pane_text_container"]}>
            {updateTime}<br/>
            <span>
              {settingTexts.github.lastUpdate}
            </span>
          </div>
          <IconButton
            color="gray"
            icon="refresh"
            disabled={loading}
            className={styles["icon_button"]}
            onClick={this.refreshGithubDatas}
          />
        </div>
        <SwitcherPane
          text={settingTexts.github.openShare}
          onChange={this.postGithubShareStatus}
          checked={githubInfo.openShare}
          disabled={githubInfo.loading}
        />
        <SwitcherPane
          text={settingTexts.resume.openShare}
          onChange={this.postResumeShareStatus}
          checked={resumeInfo.openShare}
          disabled={resumeInfo.loading}
        />
      </div>
    );
  }
}

export default MobileSetting;
