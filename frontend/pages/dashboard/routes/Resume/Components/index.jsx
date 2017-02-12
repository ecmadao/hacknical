import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from 'COMPONENTS/Button';
import IconButton from 'COMPONENTS/IconButton';
import styles from '../styles/resume.css';
import { RESUME_SECTIONS } from 'SHAREDPAGE/datas/resume';
import ResumeSection from './ResumeSection';
import ResumeModalV2 from './ResumeModal/v2';
import IntroModal from './IntroModal';
import actions from '../redux/actions';
import Hotkeys from 'UTILS/hotkeys';

const INTROS = [
  '逐步完善你的简历，随时可以通过 cmd/win + s 快捷键保存简历',
  '点击 "预览"（或 cmd/win + p 以预览当前简历）'
];
const TIPS = [
  '技术热情很重要',
  '请展现你的做事态度',
  '大家都喜欢学习能力强，能够自我进步的人',
  '技术经验越多越好；但如果缺乏，至少要表现出成长潜力'
];

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openIntroModal: false,
      openModal: false,
      activeSection: RESUME_SECTIONS[0].id
    };
    this.handleModalStatus = this.handleModalStatus.bind(this);
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
    this.bindHotkeys();
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
    const { activeSection, openModal, openIntroModal } = this.state;
    const { resume, actions } = this.props;

    const currentIndex = this.currentIndex;
    const max = RESUME_SECTIONS.length;

    return (
      <div className={styles["resume_container"]}>
        <div id="resume_navigation" className={styles["resume_navigation"]}>
          {this.renderNavigation()}
        </div>
        <div className={styles["resume_operations"]}>
          <div className={styles["operations_wrapper"]}>
            <Button
              value="预览"
              color="dark"
              onClick={() => this.handleModalStatus(true)}
              leftIcon={(
                <i className="fa fa-file-text-o" aria-hidden="true"></i>
              )}
            />
            <Button
              value="保存"
              leftIcon={(
                <i className="fa fa-save" aria-hidden="true"></i>
              )}
              onClick={actions.saveResume}
            />
            <IconButton
              icon="question"
              className={styles["resume_helper"]}
              onClick={() => this.handleIntroModalStatus(true)}
            />
          </div>
        </div>
        <div className={styles["resume_sections"]}>
          <ResumeSection section={activeSection} />
          <div className={cx(styles["resume_operations"], styles["bottom"])}>
            <div className={styles["operations_wrapper"]}>
              {currentIndex > 0 && (
                <Button
                  value="上一步"
                  color="gray"
                  leftIcon={(
                    <i className="fa fa-angle-left" aria-hidden="true"></i>
                  )}
                  onClick={() => this.handleSectionIndexChange(currentIndex - 1)}
                />
              )}
              {currentIndex < max - 1 && (
                <Button
                  value="下一步"
                  rightIcon={(
                    <i className="fa fa-angle-right" aria-hidden="true"></i>
                  )}
                  onClick={() => this.handleSectionIndexChange(currentIndex + 1)}
                />
              )}
            </div>
          </div>
        </div>
        <ResumeModalV2
          resume={resume}
          openModal={openModal}
          onClose={() => this.handleModalStatus(false)}
        />
        <IntroModal
          openModal={openIntroModal}
          onClose={() => this.handleIntroModalStatus(false)}
          intros={INTROS}
          tips={TIPS}
        />
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
