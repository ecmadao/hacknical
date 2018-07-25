import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input, InputGroupV2, SelectorV2, Switcher } from 'light-ui';
import resumeActions from '../../redux/actions';
import { GENDERS } from 'UTILS/constant/resume';
import styles from '../../styles/resume.css';
import locales from 'LOCALES';
import SectionWrapper from './shared/SectionWrapper';

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
      name,
      email,
      phone,
      disabled,
      location,
      intention,
      hireAvailable,
      freshGraduate,
      gender = 'male',
    } = this.props;

    const [prefix, suffix] = email.split('@');

    return (
      <SectionWrapper {...this.props}>
        <div className={styles.resume_piece_container}>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              value={name}
              disabled={disabled}
              placeholder={resumeTexts.name}
              onChange={this.handleInfoChange('name')}
            />
            <SelectorV2
              theme="flat"
              value={gender}
              options={GENDERS}
              disabled={disabled}
              onChange={this.handleInfoChange('gender')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <InputGroupV2
              sections={[
                {
                  value: prefix,
                  placeholder: resumeTexts.emailPrefix,
                  onChange: val => this.handleInfoChange('email')(`${val}@${suffix}`)
                },
                {
                  value: '@',
                  disabled: true,
                  style: {
                    width: 30,
                    padding: 0,
                    textAlign: 'center',
                  }
                },
                {
                  value: suffix,
                  placeholder: resumeTexts.emailSuffix,
                  style: { width: 100 },
                  onChange: val => this.handleInfoChange('email')(`${prefix}@${val}`)
                }
              ]}
              theme="flat"
            />
            <Input
              type="phone"
              theme="flat"
              value={phone}
              disabled={disabled}
              placeholder={resumeTexts.phone}
              onChange={this.handleInfoChange('phone')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              value={intention}
              disabled={disabled}
              placeholder={resumeTexts.job}
              onChange={this.handleInfoChange('intention')}
            />
            <Input
              theme="flat"
              value={location}
              disabled={disabled}
              placeholder={resumeTexts.position}
              onChange={this.handleInfoChange('location')}
            />
          </div>
          <div className={styles.resumeRow}>
            <div className={styles.resumeSwitcherWrapper}>
              {resumeTexts.freshGraduate}
              &nbsp;&nbsp;
              <Switcher
                version="v2"
                disabled={disabled}
                checked={freshGraduate}
                onChange={this.handleResumeTypeChange}
              />
            </div>
            &nbsp;&nbsp;&nbsp;
            <div className={styles.resumeSwitcherWrapper}>
              {resumeTexts.hireAvailable}
              &nbsp;&nbsp;
              <Switcher
                version="v2"
                disabled={disabled}
                checked={hireAvailable}
                onChange={this.handleAvailableChange}
              />
            </div>
          </div>
        </div>
        <div />
      </SectionWrapper>
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
