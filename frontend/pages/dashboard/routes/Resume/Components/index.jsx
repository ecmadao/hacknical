/* eslint no-param-reassign: "off" */

import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton, Tipso } from 'light-ui';

import styles from '../styles/resume.css';
import ShareModal from 'SHARED/components/ShareModal';
import ResumeSection from './ResumeSection';
import ResumeModal from './ResumeModal';
import TemplateModal from './TemplateModal';
import IntroModal from './IntroModal';
import resumeActions from '../redux/actions';
import Hotkeys from 'UTILS/hotkeys';
import locales from 'LOCALES';
import ResumeFormatter from 'SHARED/components/ResumeStateWrapper/ResumeFormatter';
import message from 'SHARED/utils/message';
import { INTROS } from 'SHARED/datas/resume';

const resumeTexts = locales('resume');
const editedConfirm = resumeTexts.editedConfirm

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
    this.handleModalStatus = this.handleModalStatus.bind(this);
    this.handleShareModalStatus = this.handleShareModalStatus.bind(this);
    this.handleTemplateModalStatus = this.handleTemplateModalStatus.bind(this);
    this.handleIntroModalStatus = this.handleIntroModalStatus.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleSectionIndexChange = this.handleSectionIndexChange.bind(this);
  }

  componentDidMount() {
    const $navigation = $('#resume_navigation');
    const navTop = $navigation.offset().top;
    const $document = $(document);
    $(window).scroll(() => {
      const currentTop = $document.scrollTop();
      if (currentTop + 80 + 65 >= navTop) {
        const navLeft = $navigation.offset().left;
        $navigation.css({
          position: 'fixed',
          left: navLeft,
          top: 80
        });
      } else {
        $navigation.css({
          position: 'absolute',
          left: -120,
          top: 63
        });
      }
    });
    this.props.actions.fetchResume();
    this.props.actions.fetchPubResumeStatus();
    this.bindHotkeys();

    if (window.addEventListener) {
      window.addEventListener('beforeunload', this.onBeforeUnload, true);
    } else {
      window.attachEvent('onbeforeunload', this.onBeforeUnload);
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;
    actions.resetEdited();
    if (window.removeEventListener) {
      window.removeEventListener('beforeunload', this.onBeforeUnload, true);
    } else {
      window.detachEvent('onbeforeunload', this.onBeforeUnload);
    }
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
    message.notice(resumeTexts.messages.download, 1800);
    const { actions } = this.props;
    actions.downloadResume();
  }

  bindHotkeys() {
    const hotkeys = new Hotkeys();
    hotkeys
      .save(this.props.actions.saveResume)
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

  renderNavigation() {
    const { resume } = this.props;
    const { activeSection, sections } = resume;
    return sections.map((section, index) => {
      const { id, text } = section;
      const sectionClass = cx(
        styles.resume_section,
        activeSection === id && styles.active
      );
      return (
        <div className={sectionClass} key={index}>
          <div
            className={styles.section_wrapper}
            onClick={() => this.handleSectionChange(id)}
          >
            {text}
          </div>
        </div>
      );
    });
  }

  get currentIndex() {
    const { activeSection, sections } = this.props.resume;
    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.id === activeSection) {
        currentIndex = index;
      }
    });
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
        <div id="resume_navigation" className={styles.resume_navigation}>
          {this.renderNavigation()}
        </div>
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
              onClick={() => this.handleModalStatus(true)}
              className={styles.operation}
              leftIcon={(
                <i className="fa fa-file-text-o" aria-hidden="true" />
              )}
            />
            <Button
              value={resumeTexts.buttons.save}
              className={styles.operation}
              onClick={actions.saveResume}
              leftIcon={(
                <i className="fa fa-save" aria-hidden="true" />
              )}
            />
          </div>
        </div>
        <div className={styles.resume_sections}>
          <ResumeSection section={activeSection} disabled={loading} />
          <div className={cx(styles.resume_operations, styles.bottom)}>
            <div className={styles.operations_wrapper}>
              {currentIndex > 0 && (
                <Button
                  value={resumeTexts.buttons.pre}
                  color="dark"
                  className={styles.operation}
                  onClick={() => this.handleSectionIndexChange(currentIndex - 1)}
                  leftIcon={(
                    <i className="fa fa-angle-left" aria-hidden="true" />
                  )}
                />
              )}
              {currentIndex < max - 1 && (
                <Button
                  value={resumeTexts.buttons.next}
                  className={styles.operation}
                  onClick={() => this.handleSectionIndexChange(currentIndex + 1)}
                  rightIcon={(
                    <i className="fa fa-angle-right" aria-hidden="true" />
                  )}
                />
              )}
            </div>
          </div>
        </div>
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
          intros={INTROS}
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
