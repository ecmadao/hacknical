/* eslint no-param-reassign: "off", global-require: "off" */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Push from 'push.js'
import deepcopy from 'deepcopy'
import styles from '../styles/resume.css'
import ShareModal from 'COMPONENTS/ShareModal'
import ResumeSection from './ResumeSection'
import ResumeModal from './ResumeModal'
import TemplateModal from './TemplateModal'
import IntroModal from './IntroModal'
import resumeActions from '../redux/actions'
import Hotkeys from 'UTILS/hotkeys'
import locales from 'LOCALES'
import API from 'API'
import objectAssign from 'UTILS/object-assign'
import ResumeFormatter from 'SHARED/components/ResumeWrapper/ResumeFormatter'
import message from 'UTILS/message'
import HeartBeat from 'UTILS/heartbeat'
import NavSection from './NavSection'
import ResumeOperations from './Operations'
import { REMOTE_ASSETS } from 'UTILS/constant'
import {
  RESUME_SECTION_IDS,
  getResumeSectionIntroBySection
} from 'UTILS/constant/resume'
import DragableNavigation from 'SHARED/components/DragableNavigation'

const resumeTexts = locales('resume')
const { editedConfirm, messages } = resumeTexts

class Resume extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: false,
      openIntroModal: false,
      openShareModal: false,
      openTemplateModal: false
    }

    this.onBeforeUnload = this.onBeforeUnload.bind(this)
    this.downloadResume = this.downloadResume.bind(this)
    this.handlePreview = this.handlePreview.bind(this)
    this.handleModalStatus = this.handleModalStatus.bind(this)
    this.handleShareModalStatus = this.handleShareModalStatus.bind(this)
    this.handleTemplateModalStatus = this.handleTemplateModalStatus.bind(this)
    this.handleIntroModalStatus = this.handleIntroModalStatus.bind(this)

    this.handleSectionIndexChange = this.handleSectionIndexChange.bind(this)
  }

  componentDidMount() {
    this.fetchResume()
    this.bindHotkeys()

    if (window.addEventListener) {
      window.addEventListener('beforeunload', this.onBeforeUnload, true)
    } else {
      window.attachEvent('onbeforeunload', this.onBeforeUnload)
    }

    this.heartBeat = new HeartBeat({
      interval: 600000, // 10 min
      callback: () => {
        const { actions, resume } = this.props
        if (resume.edited && !resume.posting && !resume.loading) actions.saveResume()
      }
    })
    this.heartBeat.takeoff()
  }

  fetchResume() {
    const { actions } = this.props
    actions.fetchPubResumeStatus().then(() => actions.fetchResume())
  }

  componentWillUnmount() {
    const { actions } = this.props
    actions.toggleEdited(false)
    if (window.removeEventListener) {
      window.removeEventListener('beforeunload', this.onBeforeUnload, true)
    } else {
      window.detachEvent('onbeforeunload', this.onBeforeUnload)
    }
    this.heartBeat && this.heartBeat.stop()
  }

  onBeforeUnload(e) {
    const { resume } = this.props
    if (!resume.edited) return
    e = e || window.event
    if (e) {
      e.returnValue = editedConfirm
    }
    return editedConfirm
  }

  downloadResume(pageStyle) {
    message.notice(messages.download, 1800)
    const { actions, resume } = this.props
    actions.toggleDownloadButton(true)

    API.resume.download(pageStyle).then((result) => {
      if (result) {
        const { name } = resume.info
        Push.create(messages.downloadSuccess, {
          icon: REMOTE_ASSETS.NOTIFY_ICON,
          timeout: 3000
        })
        const a = document.createElement('a')
        a.href = result
        a.download = `${name ? `${name}-resume` : 'resume'}-hacknical.pdf`
        a.click()
      } else {
        Push.create(messages.downloadError, {
          icon: REMOTE_ASSETS.NOTIFY_ICON,
          timeout: 3000
        })
      }
      actions.toggleDownloadButton(false)
    })
  }

  bindHotkeys() {
    const hotkeys = new Hotkeys()
    hotkeys
      .save(
        () => this.props.actions.saveResume('message=1')
      )
      .preview(() => this.handleModalStatus(true))
      .next(() => {
        const currentIndex = this.sectionActiveIndex
        this.handleSectionIndexChange(currentIndex + 1)
      })
      .previous(() => {
        const currentIndex = this.sectionActiveIndex
        this.handleSectionIndexChange(currentIndex - 1)
      })
  }

  handleModalStatus(openModal) {
    this.setState({ openModal })
  }

  handlePreview() {
    const { actions, resume, posting, loading } = this.props
    if (resume.edited && !posting && !loading) {
      actions.saveResume()
    }
    this.handleModalStatus(true)
  }

  handleShareModalStatus(openShareModal) {
    this.setState({ openShareModal })
  }

  handleTemplateModalStatus(openTemplateModal) {
    this.setState({ openTemplateModal })
  }

  handleIntroModalStatus(openIntroModal) {
    this.setState({ openIntroModal })
  }

  get sectionActiveIndex() {
    const { activeSection } = this.props.resume

    const currentIndex = this.sections.findIndex(
      section => section.id === activeSection
    )
    return currentIndex
  }

  get sectionMaxLength() {
    return this.sections.length
  }

  get sections() {
    const { shareInfo } = this.props.resume
    return shareInfo.resumeSections.map(section => objectAssign({}, section, {
      disabled: section.editable === false,
      title: section.tag === RESUME_SECTION_IDS.CUSTOM
        ? section.title
        : getResumeSectionIntroBySection(section).title.text
    }))
  }

  get currentSection() {
    const { activeSection } = this.props.resume

    return this.sections.find(section => section.id === activeSection)
  }

  handleSectionIndexChange(index) {
    const section = this.sections[index]
    if (section) {
      this.props.actions.handleActiveSectionChange(section.id)
    }
  }

  renderSectionCreator() {
    const { resume, actions } = this.props
    const { customModules } = resume
    return (
      <NavSection
        customModules={customModules}
        handleSubmit={actions.addCustomModule}
      />
    )
  }

  render() {
    const {
      openModal,
      openIntroModal,
      openShareModal,
      openTemplateModal,
    } = this.state
    const {
      login,
      resume,
      actions,
    } = this.props
    const {
      posting,
      loading,
      shareInfo,
      activeSection,
      downloadDisabled
    } = resume

    const { url, openShare, template } = shareInfo

    const origin = window.location.origin
    const currentIndex = this.sectionActiveIndex
    const max = this.sectionMaxLength

    return (
      <div className={styles.resume_container}>
        <DragableNavigation
          id="resume_navigation"
          sections={this.sections}
          disabled={posting || loading}
          activeSection={activeSection}
          onReorder={actions.updateResumeSections}
          onActiveChange={actions.handleActiveSectionChange}
          tail={this.renderSectionCreator()}
        />
        <ResumeOperations
          posting={posting}
          saveResume={actions.saveResume}
          saveDisabled={posting || loading}
          downloadDisabled={downloadDisabled}
          handlePreview={this.handlePreview}
          downloadResume={this.downloadResume}
          handleShareModalStatus={this.handleShareModalStatus}
          handleIntroModalStatus={this.handleIntroModalStatus}
          handleTemplateModalStatus={this.handleTemplateModalStatus}
        />
        <ResumeSection
          maxIndex={max}
          disabled={loading}
          currentIndex={currentIndex}
          section={{
            id: this.currentSection.id,
            text: this.currentSection.title.headline
              || this.currentSection.title
          }}
          onSectionChange={this.handleSectionIndexChange}
        />
        <ResumeFormatter
          resume={deepcopy(resume)}
          shareInfo={shareInfo}
          openModal={openModal}
          onShare={() => this.handleShareModalStatus(true)}
          onClose={() => this.handleModalStatus(false)}
          onDownload={this.downloadResume}
        >
          <ResumeModal login={login} />
        </ResumeFormatter>
        <IntroModal
          openModal={openIntroModal}
          onClose={() => this.handleIntroModalStatus(false)}
          intros={resumeTexts.intros}
        />
        <ShareModal
          openModal={openShareModal}
          options={{
            openShare,
            link: `${origin}/${url}`,
            text: resumeTexts.modal.shareText
          }}
          toggleShare={actions.postShareStatus}
          onClose={() => this.handleShareModalStatus(false)}
        />
        {openTemplateModal ? (
          <TemplateModal
            openModal={openTemplateModal}
            template={template}
            onClose={() => this.handleTemplateModalStatus(false)}
            onTemplateChange={actions.postShareTemplate}
          />
        ) : null}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    resume: state.resume,
    login: state.app.login
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume)
