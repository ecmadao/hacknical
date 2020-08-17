
import React from 'react'
import { connect } from 'react-redux'
import cx from 'classnames'
import { bindActionCreators } from 'redux'
import { Loading, Button, Input, ClassicCard } from 'light-ui'
import TimePicker from 'rc-times'
import 'rc-times/css/timepicker.css'
import settingActions from '../../../redux/actions'
import styles from '../styles/setting.css'
import locales from 'LOCALES'
import { getGitHubSectionIntroBySection } from 'UTILS/constant/github'
import { REMINDER_PREFIX, REMINDER_INTERVALS, getResumeSectionIntroBySection } from 'UTILS/constant/resume'
import Panel from '../../shared/Panel'
import InputPanel from '../../shared/InputPanel'
import CheckPanel from '../../shared/CheckPanel'
import SwitcherPanel from '../../shared/SwitcherPanel'
import TextPanel from '../../shared/TextPanel'
import Icon from 'COMPONENTS/Icon'
import DragAndDrop from 'COMPONENTS/DragAndDrop'
import message from 'UTILS/message'

const settingTexts = locales('dashboard.setting')

const RenderSectionsOrdering = (props = {}) => {
  const { getSectionIntroBySection } = props

  return [
    <Panel key={`${props.id}-1`}>
      <TextPanel
        id={props.id}
        tipso={settingTexts.order.orderingTip}
        text={settingTexts.order.ordering}
      />
    </Panel>,
    <Panel key={`${props.id}-2`}>
      <DragAndDrop
        droppableId={props.droppableId}
        itemClassName={styles.subDragableSection}
        containerClassName={styles.subDragableWrapper}
        onDragEnd={order => props.onSectionReorder(order)}
      >
        {props.sections.map((section, sectionIndex) => ({
          id: section.id,
          disabled: section.editable === false,
          Component: (
            <CheckPanel
              key={section.id}
              className={styles['subSection-clickable']}
              text={getSectionIntroBySection(section).title.text}
              checked={section.enabled}
              disabled={section.editable === false}
              onChange={props.onSectionChange(sectionIndex)}
            />
          )
        }))}
      </DragAndDrop>
    </Panel>
  ]
}

const getReminderIndex = (value) => {
  let index = REMINDER_INTERVALS.findIndex(obj => obj.id === value)
  if (index === -1) index = 0
  return index
}

class DesktopSetting extends React.Component {
  constructor(props) {
    super(props)
    this.onReminderChange = this.onReminderChange.bind(this)
    this.postResumeReminderChange = this.postResumeReminderChange.bind(this)
  }

  componentDidMount() {
    const { actions } = this.props
    actions.fetchGithubUpdateStatus()
    actions.fetchResumeShareInfo()
    actions.fetchGithubShareInfo()
  }

  reorderSections(sectionKey) {
    const { resumeInfo, actions } = this.props

    return (order) => {
      const sections = [...resumeInfo[sectionKey]]

      const fromIndex = order.source.index
      const toIndex = order.destination.index
      if (toIndex === fromIndex) return

      if (sections[fromIndex].editable === false) {
        message.error(settingTexts.order.orderingError)
        return
      }

      for (let i = fromIndex - 1; i >= toIndex; i -= 1) {
        if (sections[i].editable === false) {
          message.error(settingTexts.order.orderingFixedError)
          return
        }
      }

      const [section] = sections.splice(fromIndex, 1)

      sections.splice(toIndex, 0, section)
      actions.patchResumeChange({ [sectionKey]: sections })
    }
  }

  renderSectionsOrdering(sectionKey, getSectionIntroBySection) {
    const { resumeInfo, actions } = this.props
    const sections = resumeInfo[sectionKey]
    if (!Array.isArray(sections)) throw new Error(`Invalidate section key ${sectionKey}`)

    const onSectionChange = sectionIndex => checked =>
      actions.patchResumeSections(sectionKey, sectionIndex, checked)

    return (
      <RenderSectionsOrdering
        sections={sections}
        id={`${sectionKey}-ordering-panel`}
        droppableId={`${sectionKey}-DAD`}
        onSectionChange={onSectionChange}
        onSectionReorder={this.reorderSections(sectionKey)}
        getSectionIntroBySection={getSectionIntroBySection}
      />
    )
  }

  renderResumeGithubSetting() {
    const { resumeInfo, actions, switcher } = this.props

    return (
      <Panel key="resumeGithubSetting-1">
        <SwitcherPanel
          switcher={switcher}
          id="use-github-switch"
          text={settingTexts.resume.useGithub}
          onChange={() => actions.toggleResumeInfo('useGithub')}
          checked={(resumeInfo && resumeInfo.useGithub) || false}
          disabled={resumeInfo.loading}
        />
      </Panel>
    )
  }

  onReminderChange({ indexs }) {
    const index = indexs[0]
    const id = REMINDER_INTERVALS[index].id
    this.postResumeReminderChange('type')(id)
  }

  postResumeReminderChange(key) {
    const { actions } = this.props
    return val => actions.postResumeReminderChange(key, val)
  }

  renderResumeReminderSetting() {
    const {
      switcher,
      resumeInfo
    } = this.props

    const resumeInfoLoading = resumeInfo && resumeInfo.loading
    const panels = []

    panels.push((
      <Panel key="resumeReminderSetting-1">
        <SwitcherPanel
          switcher={switcher}
          text={settingTexts.resume.reminder.title}
          onChange={this.postResumeReminderChange('enable')}
          disabled={resumeInfoLoading || resumeInfo.disabled}
          checked={(resumeInfo && resumeInfo.reminder.enable) || false}
        />
      </Panel>
    ))

    if (resumeInfo && resumeInfo.reminder.enable) {
      panels.push((
        <Panel key="resumeReminderSetting-2">
          <div className={cx(styles.info_container, styles.subSection)}>
            <TimePicker
              sections={[
                {
                  prefix: REMINDER_PREFIX,
                  times: REMINDER_INTERVALS.map(obj => obj.value),
                  activeIndex: getReminderIndex(resumeInfo.reminder.type)
                }
              ]}
              color="yellow"
              padding={10}
              onTimeChange={this.onReminderChange}
            />
            &nbsp;
            {settingTexts.resume.reminder.sendEmailTo}
            &nbsp;
            <div className={styles.inputContainer}>
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
          </div>
        </Panel>
      ))
    }
    return panels
  }

  renderResumeShareSetting() {
    const {
      switcher,
      actions,
      resumeInfo,
    } = this.props

    const panels = []

    panels.push((
      <Panel key="resumeShareSetting-1">
        <SwitcherPanel
          switcher={switcher}
          text={settingTexts.resume.openShare}
          onChange={() => actions.toggleResumeInfo('openShare')}
          disabled={resumeInfo.loading || resumeInfo.disabled}
          checked={(resumeInfo && resumeInfo.openShare) || false}
        />
      </Panel>
    ))

    if (resumeInfo && resumeInfo.openShare) {
      let tip = settingTexts.resume.simplifyUrlTip
      tip = tip.replace(':login', resumeInfo.login)
      tip = tip.replace(':hash', resumeInfo.resumeHash)

      panels.push((
        <Panel key="resumeShareSetting-2">
          <SwitcherPanel
            switcher={switcher}
            className={styles.subSection}
            text={settingTexts.resume.simplifyUrl}
            tipso={tip}
            onChange={() => actions.toggleResumeInfo('simplifyUrl')}
            disabled={resumeInfo.loading || resumeInfo.disabled}
            checked={resumeInfo && resumeInfo.simplifyUrl}
          />
          <InputPanel
            className={styles.subSection}
            inputId="resumeShareUrl"
            buttonId="resumeCopyButton"
            url={
              resumeInfo.simplifyUrl
                ? `${window.location.host}/${resumeInfo.login}/resume`
                : `${window.location.host}/resume/${resumeInfo.resumeHash}`
            }
            input={{
              theme: 'borderless',
              subTheme: 'underline'
            }}
          />
        </Panel>
      ))
    }
    return panels
  }

  renderSharedLink() {
    const { githubInfo } = this.props
    if (!githubInfo.openShare) return null

    return (
      <InputPanel
        input={{
          theme: 'borderless',
          subTheme: 'underline'
        }}
        className={styles.subSection}
        inputId="githubShareUrl"
        buttonId="githubCopyButton"
        url={`${window.location.host}/${githubInfo.url}`}
      />
    )
  }

  render() {
    const {
      card,
      loading,
      actions,
      switcher,
      className,
      resumeInfo,
      githubInfo,
      updateTime,
      cardHeaderClass,
      refreshEnable
    } = this.props

    return (
      <div className={cx(styles.container, className)}>
        <div className={styles.card_container}>
          <p className={cardHeaderClass}>
            <Icon icon="github" />
            &nbsp;&nbsp;
            {settingTexts.github.title}
          </p>
          <ClassicCard {...card} className={styles.card} bgClassName={styles.cardBg} hoverable={false}>
            <Panel>
              <SwitcherPanel
                switcher={switcher}
                text={settingTexts.github.openShare}
                onChange={actions.postGithubShareStatus}
                checked={githubInfo.openShare}
                disabled={githubInfo.loading}
              />
            </Panel>
            {this.renderSharedLink()}
            {this.renderSectionsOrdering('githubSections', getGitHubSectionIntroBySection)}
            <Panel>
              {loading && (
                <Loading className={styles.info_loading} loading />
              )}
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
          </ClassicCard>
        </div>
        <div className={styles.card_container}>
          <p className={cardHeaderClass}>
            <Icon icon="file-code-o" />
            &nbsp;&nbsp;
            {settingTexts.resume.title}
          </p>
          <ClassicCard {...card} className={styles.card} bgClassName={styles.cardBg} hoverable={false}>
            {!resumeInfo && (
              <Loading className={styles.info_loading} loading />
            )}
            {this.renderResumeReminderSetting()}
            <Panel>
              <SwitcherPanel
                switcher={switcher}
                text={settingTexts.resume.autosave}
                onChange={() => actions.toggleResumeInfo('autosave')}
                disabled={resumeInfo && resumeInfo.loading}
                checked={resumeInfo && !!resumeInfo.autosave}
              />
            </Panel>
            {this.renderResumeShareSetting()}
            {this.renderSectionsOrdering('resumeSections', getResumeSectionIntroBySection)}
            {this.renderResumeGithubSetting()}
          </ClassicCard>
        </div>
      </div>
    )
  }
}

DesktopSetting.defaultProps = {
  card: {},
  switcher: {
    size: 'normal',
    version: 'v2'
  },
  resumeInfo: {
    github: {}
  },
  className: '',
  cardHeaderClass: ''
}

function mapStateToProps(state) {
  return { ...state.setting }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(settingActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DesktopSetting)
