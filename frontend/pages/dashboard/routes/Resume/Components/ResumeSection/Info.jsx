import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, SelectorV2, Switcher } from 'light-ui';

import resumeActions from '../../redux/actions';
import { GENDERS } from 'SHARED/datas/resume';
import styles from '../../styles/resume.css';
import locales from 'LOCALES';

const resumeTexts = locales('resume').sections.info;

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.handleInfoChange = this.handleInfoChange.bind(this);
    this.handleAvailableChange = this.handleAvailableChange.bind(this);
    this.handleResumeTypeChange = this.handleResumeTypeChange.bind(this);
  }

  handleInfoChange(type) {
    const { actions } = this.props;
    return (value) => {
      actions.handleInfoChange({
        [type]: value
      });
    }
  }

  handleAvailableChange() {
    const { actions, hireAvailable } = this.props;
    actions.toggleHireAvailable(!hireAvailable);
  }

  handleResumeTypeChange() {
    const { actions, freshGraduate } = this.props;
    actions.toggleResumeType(!freshGraduate);
  }

  render() {
    const {
      email,
      phone,
      name,
      gender,
      location,
      intention,
      disabled,
      hireAvailable,
      freshGraduate,
    } = this.props;
    return (
      <div className={styles.resume_piece_container}>
        <div className={styles.resume_title}>
          {resumeTexts.title}
        </div>
        <div className={styles.resume_wrapper}>
          <Input
            value={name}
            placeholder={resumeTexts.name}
            theme="flat"
            disabled={disabled}
            onChange={this.handleInfoChange('name')}
          />
          <SelectorV2
            value={gender}
            options={GENDERS}
            theme="flat"
            disabled={disabled}
            onChange={this.handleInfoChange('gender')}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <Input
            type="email"
            value={email}
            placeholder={resumeTexts.email}
            theme="flat"
            disabled={disabled}
            onChange={this.handleInfoChange('email')}
          />
          <Input
            type="phone"
            value={phone}
            placeholder={resumeTexts.phone}
            theme="flat"
            formatType="phone"
            disabled={disabled}
            onChange={this.handleInfoChange('phone')}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <Input
            value={intention}
            placeholder={resumeTexts.job}
            theme="flat"
            disabled={disabled}
            onChange={this.handleInfoChange('intention')}
          />
          <Input
            value={location}
            placeholder={resumeTexts.position}
            theme="flat"
            disabled={disabled}
            onChange={this.handleInfoChange('location')}
          />
        </div>
        <div className={styles.resumeRow}>
          {/*
          <div className={styles.resumeSwitcherWrapper}>
            {resumeTexts.freshGraduate}
            &nbsp;&nbsp;
            <Switcher
              onChange={this.handleResumeTypeChange}
              checked={freshGraduate}
              version="v2"
              disabled={disabled}
            />
          </div>
          &nbsp;&nbsp;&nbsp;
          */}
          <div className={styles.resumeSwitcherWrapper}>
            {resumeTexts.hireAvailable}
            &nbsp;&nbsp;
            <Switcher
              onChange={this.handleAvailableChange}
              checked={hireAvailable}
              version="v2"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { info } = state.resume;
  return { ...info };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);
