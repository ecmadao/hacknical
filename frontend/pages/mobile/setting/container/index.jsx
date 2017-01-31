import React from 'react';
import cx from 'classnames';

import IconButton from 'COMPONENTS/IconButton';
import Api from 'API/index';
import dateHelper from 'UTILS/date';
import styles from '../styles/setting.css';
import sharedStyles from '../../shared/styles/mobile.css';

class MobileSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      updateTime: null
    };

    this.refreshGithubDatas = this.refreshGithubDatas.bind(this);
  }

  componentDidMount() {
    Api.github.getUpdateTime().then((result) => {
      this.setUpdateTime(result);
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

  render() {
    const { loading, updateTime } = this.state;
    return (
      <div className={styles["setting"]}>
        <div className={cx(sharedStyles["mobile_card"], styles["setting_section"])}>
          <div className={styles["update_container"]}>
            {updateTime}<br/>
            <span>
              github 数据更新时间
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
