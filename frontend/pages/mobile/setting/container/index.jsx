import React from 'react';
import cx from 'classnames';
import { IconButton, Switcher } from 'light-ui';

import Api from 'API/index';
import dateHelper from 'UTILS/date';
import styles from '../styles/setting.css';
import sharedStyles from '../../shared/styles/mobile.css';
import locales from 'LOCALES';

const settingTexts = locales('dashboard').setting;
const paneStyle = cx(sharedStyles["mobile_card"], styles["setting_section"]);

const SwitcherPane = (props) => {
  const { id, onChange, checked, text } = props;
  return (
    <div className={paneStyle}>
      <div className={styles["pane_text_container"]}>
        {text}
      </div>
      <Switcher
        size="small"
        onChange={onChange}
        checked={checked}
      />
    </div>
  )
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
      }
    };

    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
    this.postShareStatus = this.postShareStatus.bind(this);
  }

  componentDidMount() {
    Api.github.getUpdateTime().then((result) => {
      this.setUpdateTime(result);
    });
    Api.github.getShareRecords().then((result) => {
      this.initialGithubInfo(result);
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
    const updateTime = data ? dateHelper.relative.secondsBefore(data) : this.state.updateTime;
    this.setState({
      loading: false,
      updateTime
    });
  }

  initialGithubInfo(datas) {
    const { openShare } = datas;
    this.setState({
      githubInfo: {
        loading: false,
        openShare
      }
    });
  }

  postShareStatus() {
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

  render() {
    const { loading, updateTime, githubInfo } = this.state;

    return (
      <div className={styles["setting"]}>
        {githubInfo.loading ? '' : (
          <SwitcherPane
            id='github-share-switch'
            text={settingTexts.github.openShare}
            onChange={this.postShareStatus}
            checked={githubInfo.openShare}
          />
        )}
        <div className={paneStyle}>
          <div className={styles["pane_text_container"]}>
            {updateTime}<br/>
            <span>
              {settingTexts.github.lastUpdate}
            </span>
          </div>
          <IconButton
            icon="refresh"
            disabled={loading}
            className={styles["icon_button"]}
            onClick={this.refreshGithubDatas}
          />
        </div>
      </div>
    )
  }
}

export default MobileSetting;
