import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';

import '../styles/resume.css';
import { RESUME_SECTIONS } from '../helper/const_value';

class Resume extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSection: RESUME_SECTIONS[0].id
    };
    this.handleSectionChange = this.handleSectionChange.bind(this);
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

  render() {
    return (
      <div className="resume_container">
        <div className="resume_navigation">
          {this.renderNavigation()}
        </div>
      </div>
    )
  }
}

export default connect()(Resume);
