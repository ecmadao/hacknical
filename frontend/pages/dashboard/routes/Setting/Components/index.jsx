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
import locales from 'LOCALES';

const settingTexts = locales('dashboard').setting;

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
    resumeInfo && resumeInfo.loading && actions.fetchResumeShareInfo();
    githubInfo && githubInfo.loading && actions.fetchGithubShareInfo();
  }

  render() {
    const { loading, updateTime, actions, resumeInfo, githubInfo } = this.props;
    const shareSection = (section) => (checked) => actions.postResumeShareSection(section, checked);

    const resumeInfoLoading = resumeInfo && resumeInfo.loading;

    return (
      <div>
        <div className={styles['card_container']}>
          <p><i aria-hidden="true" className="fa fa-github"></i>&nbsp;&nbsp;{settingTexts.github.title}</p>
          <div className={styles.card}>
            <div className={styles['info_container_wrapper']}>
              {githubInfo.loading ? '' : (
                <SwitcherPane
                  id='github-share-switch'
                  text={settingTexts.github.openShare}
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
                  {settingTexts.github.lastUpdate}{updateTime}
                </div>
                <Button
                  value={settingTexts.github.updateButtonText}
                  style="flat"
                  onClick={actions.refreshGithubDatas}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['card_container']}>
          <p><i aria-hidden="true" className="fa fa-file-code-o"></i>&nbsp;&nbsp;{settingTexts.resume.title}</p>
          <div className={styles.card}>
            {!resumeInfo ? (
              <BaseModal className={styles['info_loading']} showModal={true} />
            ) : ''}
            {(resumeInfoLoading) ? (
              <Loading className={styles['info_loading']} />
            ) : (
              <div className={styles['info_container_wrapper']}>
                <SwitcherPane
                  id='resume-share-switch'
                  text={settingTexts.resume.openShare}
                  onChange={resumeInfoLoading ? () => {} : actions.postResumeShareStatus}
                  checked={(resumeInfo && resumeInfo.openShare) || false}
                />
                <SwitcherPane
                  id='use-github-switch'
                  text={settingTexts.resume.useGithub}
                  onChange={resumeInfoLoading ? () => {} : actions.postResumeGithubStatus}
                  checked={(resumeInfo && resumeInfo.useGithub) || false}
                />
                {resumeInfo && resumeInfo.useGithub && resumeInfo.github ? (
                  <div className={styles['info_container_wrapper']}>
                    <CheckPane
                      text={settingTexts.resume.showHotmap}
                      checked={resumeInfo.github.hotmap}
                      onChange={shareSection('hotmap')}
                    />
                    <CheckPane
                      text={settingTexts.resume.showRepos}
                      checked={resumeInfo.github.repos}
                      onChange={shareSection('repos')}
                    />
                    <CheckPane
                      text={settingTexts.resume.showLanguages}
                      checked={resumeInfo.github.languages}
                      onChange={shareSection('languages')}
                    />
                    <CheckPane
                      text={settingTexts.resume.showCommits}
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
