import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';

import Loading from 'COMPONENTS/Loading';
import BaseModal from 'COMPONENTS/BaseModal';
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

const CheckPane = (props) => {
  const { onChange, checked, text } = props;
  return (
    <div
      onClick={() => onChange(!checked)}
      className={cx(
      styles['info_container_large'],
      styles['check_info_container']
    )}>
      <div className={styles.info}>
        {text}
      </div>
      <div className={styles['check_container']}>
        <i aria-hidden="true" className={`fa fa-${checked ? 'check-square' : 'square-o'}`}></i>
      </div>
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
    const shareSection = (section) => (checked) => actions.postResumeShareSection(section, checked);

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
            {!resumeInfo ? (
              <BaseModal className={styles['info_loading']} showModal={true} />
            ) : ''}
            {(resumeInfo && resumeInfo.loading) ? (
              <Loading className={styles['info_loading']} />
            ) : (
              <div className={styles['info_container_wrapper']}>
                <SwitcherPane
                  id='resume-share-switch'
                  text='开启简历的分享'
                  onChange={actions.postResumeShareStatus}
                  checked={(resumeInfo && resumeInfo.openShare) || false}
                />
                <SwitcherPane
                  id='use-github-switch'
                  text='在简历中附加我的 github 分析报告'
                  onChange={actions.postResumeGithubStatus}
                  checked={(resumeInfo && resumeInfo.useGithub) || false}
                />
                {resumeInfo && resumeInfo.useGithub && resumeInfo.github ? (
                  <div className={styles['info_container_wrapper']}>
                    <CheckPane
                      text="展示 提交信息热点图"
                      checked={resumeInfo.github.hotmap}
                      onChange={shareSection('hotmap')}
                    />
                    <CheckPane
                      text="展示 仓库概览"
                      checked={resumeInfo.github.repos}
                      onChange={shareSection('repos')}
                    />
                    <CheckPane
                      text="展示 语言概览"
                      checked={resumeInfo.github.languages}
                      onChange={shareSection('languages')}
                    />
                    <CheckPane
                      text="展示 commit 概览"
                      checked={resumeInfo.github.commits}
                      onChange={shareSection('commits')}
                    />
                  </div>
                ) : ''}
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
