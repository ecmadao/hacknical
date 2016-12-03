import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import Button from 'COMPONENTS/Button';
import '../styles/resume.css';
import { RESUME_SECTIONS } from '../helper/const_value';
import ResumeSection from './ResumeSection/index';

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: RESUME_SECTIONS[0].id
    };
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleSectionIndexChange = this.handleSectionIndexChange.bind(this);
  }

  handleSectionChange(id) {
    const {activeSection} = this.state;
    if (activeSection !== id) {
      this.setState({
        activeSection: id
      });
    }
  }

  renderNavigation() {
    const {activeSection} = this.state;
    return RESUME_SECTIONS.map((section, index) => {
      const {id, text} = section;
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
    const {activeSection} = this.state;
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
    const {activeSection} = this.state;
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
            />
            <Button
              value="保存"
            />
          </div>
        </div>
        <div className="resume_sections">
          <ResumeSection section={activeSection}/>
          <div className="resume_operations">
            <div className="operations_wrapper">
              {currentIndex > 0 && (
                <Button
                  value="上一步"
                  className="dark"
                  onClick={() => this.handleSectionIndexChange(currentIndex - 1)}
                />
              )}
              {currentIndex < max - 1 && (
                <Button
                  value="下一步"
                  onClick={() => this.handleSectionIndexChange(currentIndex + 1)}
                />
              )}
              {currentIndex === max - 1 && (
                <Button value="完成"/>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(Resume);
