/* eslint no-param-reassign: "off" */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Push from 'push.js';
import { Button, IconButton, Tipso } from 'light-ui';
import styles from '../styles/resume.css';
import ShareModal from 'COMPONENTS/ShareModal';
import ResumeSection from './ResumeSection';
import ResumeModal from './ResumeModal';
import TemplateModal from './TemplateModal';
import IntroModal from './IntroModal';
import resumeActions from '../redux/actions';
import Hotkeys from 'UTILS/hotkeys';
import locales from 'LOCALES';
import API from 'API';
import ResumeFormatter from 'SHARED/components/ResumeWrapper/ResumeFormatter';
import message from 'UTILS/message';
import Navigation from 'COMPONENTS/Navigation';
import HeartBeat from 'UTILS/heartbeat';

const resumeTexts = locales('resume');
const { editedConfirm, messages } = resumeTexts;

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openIntroModal: false,
      openShareModal: false,
      openTemplateModal: false,
    };

    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.downloadResume = this.downloadResume.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleModalStatus = this.handleModalStatus.bind(this);
    this.handleShareModalStatus = this.handleShareModalStatus.bind(this);
    this.handleTemplateModalStatus = this.handleTemplateModalStatus.bind(this);
    this.handleIntroModalStatus = this.handleIntroModalStatus.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleSectionIndexChange = this.handleSectionIndexChange.bind(this);
  }

  componentDidMount() {
    this.props.actions.fetchResume();
    this.props.actions.fetchPubResumeStatus();
    this.bindHotkeys();

    if (window.addEventListener) {
      window.addEventListener('beforeunload', this.onBeforeUnload, true);
    } else {
      window.attachEvent('onbeforeunload', this.onBeforeUnload);
    }

    // this.heartBeat = new HeartBeat({
    //   interval: 60000, // 1 min
    //   callback: () => {
    //     const { resume, actions } = this.props;
    //     if (resume.edited) {
    //       actions.saveResume();
    //     }
    //   }
    // });
    // this.heartBeat.takeoff();
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.toggleEdited(false);
    if (window.removeEventListener) {
      window.removeEventListener('beforeunload', this.onBeforeUnload, true);
    } else {
      window.detachEvent('onbeforeunload', this.onBeforeUnload);
    }
    this.heartBeat && this.heartBeat.stop();
  }

  onBeforeUnload(e) {
    const { resume } = this.props;
    if (!resume.edited) return;
    e = e || window.event;
    if (e) {
      e.returnValue = editedConfirm;
    }
    return editedConfirm;
  }

  downloadResume() {
    message.notice(messages.download, 1800);
    const { actions, resume } = this.props;
    actions.toggleDownloadButton(true);
    API.resume.download().then((result) => {
      if (result) {
        const { name } = resume.info;
        Push.create(messages.downloadSuccess, {
          icon: '/vendor/images/hacknical-logo-nofity.png',
          timeout: 3000,
        });
        const a = document.createElement('a');
        a.href = result;
        a.download = `${name ? `${name}-resume` : 'resume'}-hacknical.pdf`;
        a.click();
      } else {
        Push.create(messages.downloadError, {
          icon: '/vendor/images/hacknical-logo-nofity.png',
          timeout: 3000,
        });
      }
      actions.toggleDownloadButton(false);
    });
  }

  bindHotkeys() {
    const hotkeys = new Hotkeys();
    hotkeys
      .save(
        () => this.props.actions.saveResume('message=1')
      )
      .preview(() => this.handleModalStatus(true))
      .next(() => {
        const currentIndex = this.currentIndex;
        this.handleSectionIndexChange(currentIndex + 1);
      })
      .previous(() => {
        const currentIndex = this.currentIndex;
        this.handleSectionIndexChange(currentIndex - 1);
      });
  }

  handleModalStatus(openModal) {
    this.setState({ openModal });
  }

  handlePreview() {
    const { actions, resume, posting, loading } = this.props;
    if (resume.edited && !posting && !loading) {
      actions.saveResume();
    }
    this.handleModalStatus(true);
  }

  handleShareModalStatus(openShareModal) {
    this.setState({ openShareModal });
  }

  handleTemplateModalStatus(openTemplateModal) {
    this.setState({ openTemplateModal });
  }

  handleIntroModalStatus(openIntroModal) {
    this.setState({ openIntroModal });
  }

  handleSectionChange(id) {
    this.props.actions.handleActiveSectionChange(id);
  }

  get currentIndex() {
    const { activeSection, sections } = this.props.resume;
    const currentIndex = sections.findIndex(section => section.id === activeSection);
    return currentIndex;
  }

  handleSectionIndexChange(index) {
    const section = this.props.resume.sections[index];
    this.handleSectionChange(section.id);
  }

  render() {
    const {
      openModal,
      openIntroModal,
      openShareModal,
      openTemplateModal,
    } = this.state;
    const {
      login,
      resume,
      actions,
    } = this.props;
    const {
      posting,
      loading,
      sections,
      shareInfo,
      activeSection,
      downloadDisabled,
    } = resume;
    const { url, openShare, template } = shareInfo;

    const origin = window.location.origin;
    const currentIndex = this.currentIndex;
    const max = sections.length;

    return (
      <div className={styles.resume_container}>
        <Navigation
          fixed
          id="resume_navigation"
          sections={sections}
          activeSection={activeSection}
          handleSectionChange={this.handleSectionChange}
        />
        <div className={styles.resume_operations}>
          <div className={styles.operations_wrapper}>
            <IconButton
              color="gray"
              icon="question"
              className={styles.icon_button}
              onClick={() => this.handleIntroModalStatus(true)}
            />
            <Tipso
              trigger="hover"
              theme="dark"
              className={styles.icon_button_tipso}
              tipsoContent={(<span>{resumeTexts.messages.templateTip}</span>)}
            >
              <IconButton
                color="gray"
                icon="file-text"
                className={styles.icon_button}
                onClick={() => this.handleTemplateModalStatus(true)}
              />
            </Tipso>
            <Tipso
              trigger="hover"
              theme="dark"
              className={styles.icon_button_tipso}
              tipsoContent={(<span>{resumeTexts.messages.downloadTip}</span>)}
            >
              <IconButton
                color="gray"
                icon="download"
                className={styles.icon_button}
                onClick={this.downloadResume}
                disabled={downloadDisabled}
              />
            </Tipso>
            <IconButton
              color="gray"
              icon="share-alt"
              className={styles.icon_button}
              onClick={() => this.handleShareModalStatus(true)}
            />
            <Button
              value={resumeTexts.buttons.preview}
              color="dark"
              onClick={this.handlePreview}
              className={styles.operation}
              leftIcon={(
                <i className="fa fa-file-text-o" aria-hidden="true" />
              )}
            />
            <Button
              disabled={posting}
              value={posting
                ? resumeTexts.buttons.saving
                : resumeTexts.buttons.save}
              className={styles.operation}
              onClick={() => actions.saveResume('message=1')}
              leftIcon={(
                <i className="fa fa-save" aria-hidden="true" />
              )}
            />
          </div>
        </div>
        <ResumeSection
          maxIndex={max}
          disabled={loading}
          currentIndex={currentIndex}
          section={activeSection}
          onSectionChange={this.handleSectionIndexChange}
        />
        <ResumeFormatter
          resume={resume}
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
    );
  }
}

function mapStateToProps(state) {
  return {
    resume: state.resume,
    login: state.app.login,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);
