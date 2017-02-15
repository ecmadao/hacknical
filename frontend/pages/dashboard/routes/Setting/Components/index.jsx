import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';

import Loading from 'COMPONENTS/Loading';
import Button from 'COMPONENTS/Button';
import Switcher from 'COMPONENTS/Switcher';
import actions from '../redux/actions';
import styles from '../styles/setting.css';

class Setting extends React.Component {
  componentDidMount() {
    const { actions, loading } = this.props;
    loading && actions.fetchGithubUpdateTime();
    actions.fetchResumeShareInfo();
  }

  render() {
    const { loading, updateTime, actions, resumeInfo } = this.props;

    return (
      <div>
        <div className={styles["card_container"]}>
          <p><i aria-hidden="true" className="fa fa-refresh"></i>&nbsp;&nbsp;github 数据更新</p>
          <div className={styles["card"]}>
            {loading ? (
              <Loading className={styles["info_loading"]} />
            ) : ''}
            <div className={styles["info_container"]}>
              <div className={styles["info"]}>
                最近更新时间：{updateTime}
              </div>
              <Button
                value="更新数据"
                style="flat"
                onClick={actions.refreshGithubDatas}
              />
            </div>
          </div>
        </div>
        <div className={styles["card_container"]}>
          <p><i aria-hidden="true" className="fa fa-file-code-o"></i>&nbsp;&nbsp;简历分享设置</p>
          <div className={styles["card"]}>
            {resumeInfo.loading ? (
              <Loading className={styles["info_loading"]} />
            ) : (
              <div className={styles["info_container_large"]}>
                <div className={styles["info"]}>
                  在简历中附加我的 github 分析报告
                </div>
                <Switcher
                  id="use-github-switch"
                  onChange={actions.postResumeGithubStatus}
                  checked={resumeInfo.useGithub}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {...state.setting}
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
