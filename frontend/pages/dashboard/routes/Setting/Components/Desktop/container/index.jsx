import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { bindActionCreators } from 'redux';
import { Loading, Button, SelectorV2, Input } from 'light-ui';
import settingActions from '../../../redux/actions';
import styles from '../styles/setting.css';
import locales from 'LOCALES';
import { REMINDER_INTERVALS } from 'UTILS/constant/resume';
import SwitcherPanel from './SwitcherPanel';
import Panel from './Panel';
import CheckPanel from './CheckPanel'

const settingTexts = locales('dashboard').setting;

class DesktopSetting extends React.Component {
  constructor(props) {
    super(props);
    this.postResumeReminderChange = this.postResumeReminderChange.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.fetchGithubUpdateStatus();
    actions.fetchResumeShareInfo();
    actions.fetchGithubShareInfo();
    // const { actions, loading, resumeInfo, githubInfo } = this.props;
    // loading && actions.fetchGithubUpdateStatus();
    // resumeInfo && resumeInfo.loading && actions.fetchResumeShareInfo();
    // githubInfo && githubInfo.loading && actions.fetchGithubShareInfo();
  }

  renderGithubShareSectionsSetting() {
    const { resumeInfo, actions } = this.props;
    const shareSection = section => checked =>
      actions.postResumeShareSection(section, checked);

    if (resumeInfo.useGithub && resumeInfo.github) {
      return (
        <Panel key="resumeGithubSetting-2">
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showHotmap}
            checked={resumeInfo.github.hotmap}
            onChange={shareSection('hotmap')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showRepos}
            checked={resumeInfo.github.repos}
            onChange={shareSection('repos')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showCourse}
            checked={resumeInfo.github.course}
            onChange={shareSection('course')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showOrgs}
            checked={resumeInfo.github.orgs}
            onChange={shareSection('orgs')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showLanguages}
            checked={resumeInfo.github.languages}
            onChange={shareSection('languages')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showCommits}
            checked={resumeInfo.github.commits}
            onChange={shareSection('commits')}
          />
          <CheckPanel
            className={styles['subSection-clickable']}
            text={settingTexts.resume.showContributed}
            checked={resumeInfo.github.contributed}
            onChange={shareSection('contributed')}
          />
        </Panel>
      );
    }
    return null;
  }

  renderResumeGithubSetting() {
    const { resumeInfo, actions } = this.props;
    const panels = [];

    if (resumeInfo) {
      panels.push((
        <Panel key="resumeGithubSetting-1">
          <SwitcherPanel
            id="use-github-switch"
            text={settingTexts.resume.useGithub}
            onChange={actions.postResumeGithubStatus}
            checked={(resumeInfo && resumeInfo.useGithub) || false}
            disabled={resumeInfo.loading}
          />
        </Panel>
      ));
    }
    if (!resumeInfo.loading && resumeInfo.useGithub) {
      panels.push(
        this.renderGithubShareSectionsSetting()
      );
    }
    return panels;
  }

  postResumeReminderChange(key) {
    const { actions } = this.props;
    return val => actions.postResumeReminderChange(key, val);
  }

  renderResumeReminderSetting() {
    const {
      actions,
      resumeInfo,
    } = this.props;

    const resumeInfoLoading = resumeInfo && resumeInfo.loading;
    const panels = [];

    panels.push((
      <Panel key="resumeReminderSetting-1">
        <SwitcherPanel
          text={settingTexts.resume.reminder.title}
          onChange={actions.toggleResumeReminder}
          disabled={resumeInfoLoading || resumeInfo.disabled}
          checked={(resumeInfo && resumeInfo.reminder.enable) || false}
        />
      </Panel>
    ));

    if (resumeInfo && resumeInfo.reminder.enable) {
      panels.push((
        <Panel key="resumeReminderSetting-2">
          <div className={cx(styles.info_container, styles.subSection)}>
            <SelectorV2
              color="white"
              theme="flat"
              options={REMINDER_INTERVALS}
              value={resumeInfo.reminder.type}
              onChange={this.postResumeReminderChange('type')}
            />
            &nbsp;
            {settingTexts.resume.reminder.sendEmailTo}
            &nbsp;
            <Input
              type="email"
              theme="borderless"
              subTheme="underline"
              className={styles.sectionInput}
              placeholder={settingTexts.resume.reminder.placeholder}
              value={resumeInfo.reminder.email}
              onChange={this.postResumeReminderChange('email')}
            />
          </div>
        </Panel>
      ));
    }
    return panels;
  }

  renderResumeShareSetting() {
    const {
      actions,
      resumeInfo,
    } = this.props;

    const panels = [];

    panels.push((
      <Panel key="resumeShareSetting-1">
        <SwitcherPanel
          text={settingTexts.resume.openShare}
          onChange={actions.postResumeShareStatus}
          disabled={resumeInfo.loading || resumeInfo.disabled}
          checked={(resumeInfo && resumeInfo.openShare) || false}
        />
      </Panel>
    ));

    if (resumeInfo && resumeInfo.openShare) {
      let tip = settingTexts.resume.simplifyUrlTip;
      tip = tip.replace(':login', resumeInfo.login);
      tip = tip.replace(':hash', resumeInfo.resumeHash);

      panels.push((
        <Panel key="resumeShareSetting-2">
          <SwitcherPanel
            className={styles.subSection}
            text={settingTexts.resume.simplifyUrl}
            tipso={tip}
            onChange={actions.toggleResumeSimplifyUrl}
            disabled={resumeInfo.loading || resumeInfo.disabled}
            checked={resumeInfo && resumeInfo.simplifyUrl}
          />
        </Panel>
      ));
    }
    return panels;
  }

  render() {
    const {
      loading,
      actions,
      resumeInfo,
      githubInfo,
      updateTime,
      refreshEnable
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.card_container}>
          <p>
            <i aria-hidden="true" className="fa fa-github" />
            &nbsp;&nbsp;{settingTexts.github.title}
          </p>
          <div className={styles.card}>

            <Panel>
              <SwitcherPanel
                text={settingTexts.github.openShare}
                onChange={actions.postGithubShareStatus}
                checked={githubInfo.openShare}
                disabled={githubInfo.loading}
              />
            </Panel>

            <Panel>
              {loading ? (
                <Loading className={styles.info_loading} loading />
              ) : null}
              <div className={styles.info_container}>
                <div className={styles.info}>
                  {settingTexts.github.lastUpdate}: {updateTime}
                </div>
                <Button
                  value={settingTexts.github.updateButtonText}
                  theme="flat"
                  disabled={loading || !refreshEnable}
                  onClick={actions.refreshGithubDatas}
                />
              </div>
            </Panel>

          </div>
        </div>
        <div className={styles.card_container}>
          <p>
            <i
              aria-hidden="true"
              className="fa fa-file-code-o"
            />
            &nbsp;&nbsp;{settingTexts.resume.title}
          </p>
          <div className={styles.card}>
            {!resumeInfo ? (
              <Loading className={styles.info_loading} loading />
            ) : null}
            {this.renderResumeReminderSetting()}
            {this.renderResumeShareSetting()}
            {this.renderResumeGithubSetting()}
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DesktopSetting);
