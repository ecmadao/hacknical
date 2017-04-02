import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, IconButton, Tipso } from 'light-ui';
import { Message } from 'light-ui/lib/raw';

import styles from '../styles/resume.css';
import { RESUME_SECTIONS } from 'SHARED/datas/resume';
import ShareModal from 'SHARED/components/ShareModal';
import ResumeSection from './ResumeSection';
import ResumeModalV2 from './ResumeModal/v2';
import IntroModal from './IntroModal';
import actions from '../redux/actions';
import Hotkeys from 'UTILS/hotkeys';
import locales from 'LOCALES';

const message = new Message();
const resumeTexts = locales("resume");
const INTROS = [
  {
    title: '使用说明',
    texts: [
      '逐步完善你的简历，随时可以通过 cmd/win + s 快捷键保存简历',
      '点击 "预览"（或 cmd/win + p ）以预览当前简历'
    ]
  },
  {
    title: '小建议',
    texts: [
      '技术热情很重要',
      '请展现你的做事态度',
      '大家都喜欢学习能力强，能够自我进步的人',
      '技术经验越多越好；但如果缺乏，至少要表现出成长潜力'
    ]
  }
];

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      openIntroModal: false,
      openShareModal: false,
      activeSection: RESUME_SECTIONS[0].id
    };
    this.downloadResume = this.downloadResume.bind(this);
    this.handleModalStatus = this.handleModalStatus.bind(this);
    this.handleShareModalStatus = this.handleShareModalStatus.bind(this);
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
  }

  downloadResume() {
    message.notice(resumeTexts.messages.download);
    const { actions } = this.props;
    actions.downloadResume();
  }

  bindHotkeys() {
    const hotkeys = new Hotkeys();
    hotkeys
      .save(this.props.actions.saveResume)
      .preview(() => this.handleModalStatus(true));
  }

  handleModalStatus(openModal) {
    this.setState({ openModal });
  }

  handleShareModalStatus(openShareModal) {
    this.setState({ openShareModal });
  }

  handleIntroModalStatus(openIntroModal) {
    this.setState({ openIntroModal });
  }

  handleSectionChange(id) {
    const { activeSection } = this.state;
    if (activeSection !== id) {
      this.setState({
        activeSection: id
      });
    }
  }

  renderNavigation() {
    const { activeSection } = this.state;
    return RESUME_SECTIONS.map((section, index) => {
      const { id, text } = section;
      const sectionClass = cx(
        styles["resume_section"],
        activeSection === id && styles["active"]
      );
      return (
        <div className={sectionClass} key={index}>
          <div
            className={styles["section_wrapper"]}
            onClick={() => this.handleSectionChange(id)}>
            {text}
          </div>
        </div>
      )
    });
  }

  get currentIndex() {
    const { activeSection } = this.state;
    let currentIndex = 0;
    RESUME_SECTIONS.forEach((section, index) => {
      if (section.id === activeSection) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }

  handleSectionIndexChange(index) {
    const section = RESUME_SECTIONS[index];
    this.handleSectionChange(section.id);
  }

  render() {
    const { activeSection, openModal, openIntroModal, openShareModal } = this.state;
    const { resume, actions } = this.props;
    const { shareInfo, downloadDisabled } = resume;
    const { url, openShare } = shareInfo;

    const origin = window.location.origin;
    const currentIndex = this.currentIndex;
    const max = RESUME_SECTIONS.length;

    return (
      <div className={styles["resume_container"]}>
        <div id="resume_navigation" className={styles["resume_navigation"]}>
          {this.renderNavigation()}
        </div>
        <div className={styles["resume_operations"]}>
          <div className={styles["operations_wrapper"]}>
            <IconButton
              color="gray"
              icon="question"
              className={styles["icon_button"]}
              onClick={() => this.handleIntroModalStatus(true)}
            />
            <Tipso
              trigger="hover"
              className={styles["icon_button_tipso"]}
              tipsoContent={(<span>{resumeTexts.messages.downloadTip}</span>)}>
              <IconButton
                color="gray"
                icon="download"
                className={styles["icon_button"]}
                onClick={this.downloadResume}
                disabled={downloadDisabled}
              />
            </Tipso>
            <IconButton
              color="gray"
              icon="share-alt"
              className={styles["icon_button"]}
              onClick={() => this.handleShareModalStatus(true)}
            />
            <Button
              value={resumeTexts.buttons.preview}
              color="dark"
              onClick={() => this.handleModalStatus(true)}
              className={styles.operation}
              leftIcon={(
                <i className="fa fa-file-text-o" aria-hidden="true"></i>
              )}
            />
            <Button
              value={resumeTexts.buttons.save}
              className={styles.operation}
              onClick={actions.saveResume}
              leftIcon={(
                <i className="fa fa-save" aria-hidden="true"></i>
              )}
            />
          </div>
        </div>
        <div className={styles["resume_sections"]}>
          <ResumeSection section={activeSection} />
          <div className={cx(styles["resume_operations"], styles["bottom"])}>
            <div className={styles["operations_wrapper"]}>
              {currentIndex > 0 && (
                <Button
                  value={resumeTexts.buttons.pre}
                  color="dark"
                  className={styles.operation}
                  onClick={() => this.handleSectionIndexChange(currentIndex - 1)}
                  leftIcon={(
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  )}
                />
              )}
              {currentIndex < max - 1 && (
                <Button
                  value={resumeTexts.buttons.next}
                  className={styles.operation}
                  onClick={() => this.handleSectionIndexChange(currentIndex + 1)}
                  rightIcon={(
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <ResumeModalV2
          resume={resume}
          shareInfo={shareInfo}
          openModal={openModal}
          onShare={() => this.handleShareModalStatus(true)}
          onClose={() => this.handleModalStatus(false)}
          onDownload={this.downloadResume}
        />
        <IntroModal
          openModal={openIntroModal}
          onClose={() => this.handleIntroModalStatus(false)}
          intros={INTROS}
        />
        {openShareModal ? (
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
        ) : ''}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    resume: state.resume
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Resume);
