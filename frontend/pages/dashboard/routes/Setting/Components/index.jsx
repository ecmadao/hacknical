import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';

import Loading from 'COMPONENTS/Loading';
import Button from 'COMPONENTS/Button';
import Switcher from 'COMPONENTS/Switcher';
import actions from '../redux/actions';
import styles from '../styles/setting.css';

const SwitcherPane = (props) => {
  const { id, onChange, checked, text } = props;
  return (
    <div className={styles['info_container_large']}>
      <div className={styles.info}>
        {text}
      </div>
      <Switcher
        id={id}
        onChange={onChange}
        checked={checked}
      />
    </div>
  )
};

class Setting extends React.Component {
  componentDidMount() {
    const { actions, loading, resumeInfo, githubInfo } = this.props;
    loading && actions.fetchGithubUpdateTime();
    resumeInfo.loading && actions.fetchResumeShareInfo();
    githubInfo.loading && actions.fetchGithubShareInfo();
  }

  render() {
    const { loading, updateTime, actions, resumeInfo, githubInfo } = this.props;

    return (
      <div>
        <div className={styles['card_container']}>
          <p><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;github 相关设置</p>
          <div className={styles.card}>
            <div className={styles['info_container_wrapper']}>
              {githubInfo.loading ? '' : (
                <SwitcherPane
                  id='github-share-switch'
                  text='开启 github 总结的分享'
                  onChange={actions.postGithubShareStatus}
                  checked={githubInfo.openShare}
                />
              )}
            </div>
            <div className={styles['info_container_wrapper']}>
              {loading ? (
                <Loading className={styles['info_loading']} />
              ) : ''}
              <div className={styles['info_container']}>
                <div className={styles.info}>
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
        </div>
        <div className={styles['card_container']}>
          <p><i aria-hidden="true" className="fa fa-file-code-o"></i>&nbsp;&nbsp;简历相关设置</p>
          <div className={styles.card}>
            {resumeInfo.loading ? (
              <Loading className={styles['info_loading']} />
            ) : (
              <div className={styles['info_container_wrapper']}>
                <SwitcherPane
                  id='resume-share-switch'
                  text='开启简历的分享'
                  onChange={actions.postResumeShareStatus}
                  checked={resumeInfo.openShare}
                />
                <SwitcherPane
                  id='use-github-switch'
                  text='在简历中附加我的 github 分析报告'
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
