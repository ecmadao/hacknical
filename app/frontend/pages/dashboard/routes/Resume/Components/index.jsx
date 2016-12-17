import React from 'react';
import classNames from 'classnames';

import Button from 'COMPONENTS/Button';
import '../styles/resume.css';
import { RESUME_SECTIONS } from '../helper/const_value';
import ResumeSection from './ResumeSection';
import ResumeModal from './ResumeModal';

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      activeSection: RESUME_SECTIONS[0].id
    };
    this.handleModalStatus = this.handleModalStatus.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleSectionIndexChange = this.handleSectionIndexChange.bind(this);
  }

  componentDidMount() {
    const $navigation = $('.resume_navigation');
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
    })
  }

  handleModalStatus(openModal) {
    this.setState({ openModal });
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
      const sectionClass = classNames('resume_section', {
        'active': activeSection === id
      });
      return (
        <div className={sectionClass} key={index}>
          <div
            className="section_wrapper"
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
    const { activeSection, openModal } = this.state;
    const currentIndex = this.currentIndex;
    const max = RESUME_SECTIONS.length;

    return (
      <div className="resume_container">
        <div className="resume_navigation">
          {this.renderNavigation()}
        </div>
        <div className="resume_operations">
          <div className="operations_wrapper">
            <Button
              value="预览"
              className="dark"
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
            />
          </div>
        </div>
        <div className="resume_sections">
          <ResumeSection section={activeSection} />
          <div className="resume_operations bottom">
            <div className="operations_wrapper">
              {currentIndex > 0 && (
                <Button
                  value="上一步"
                  className="dark"
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
              {currentIndex === max - 1 && (
                <Button
                  value="完成"
                  leftIcon={(
                    <i className="fa fa-save" aria-hidden="true"></i>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        <ResumeModal
          openModal={openModal}
          onClose={() => this.handleModalStatus(false)}
        />
      </div>
    )
  }
}

export default Resume;
