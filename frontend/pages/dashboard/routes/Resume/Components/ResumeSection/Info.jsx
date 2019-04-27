import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Input,
  Switcher,
  SelectorV2,
  InputGroupV2
} from 'light-ui'
import cx from 'classnames'
import Labels from 'COMPONENTS/Labels'
import resumeActions from '../../redux/actions'
import { GENDERS } from 'UTILS/constant/resume'
import styles from '../../styles/resume.css'
import locales from 'LOCALES'
import SectionWrapper from './shared/SectionWrapper'

const resumeTexts = locales('resume.sections.info')

class Info extends React.Component {
  constructor(props) {
    super(props)

    this.handleInfoChange = this.handleInfoChange.bind(this)
    this.handleAvailableChange = this.handleAvailableChange.bind(this)
    this.handleResumeTypeChange = this.handleResumeTypeChange.bind(this)

    this.handleLanguageAdded = this.handleLanguageAdded.bind(this)
    this.handleLanguageRemoved = this.handleLanguageRemoved.bind(this)
  }

  handleInfoChange(type) {
    const { actions } = this.props
    return (value) => {
      actions.handleInfoChange({
        [type]: value
      })
    }
  }

  handleAvailableChange() {
    const { actions, hireAvailable } = this.props
    actions.handleInfoChange({
      hireAvailable: !hireAvailable
    })
  }

  handleResumeTypeChange() {
    const { actions, freshGraduate } = this.props
    actions.handleInfoChange({
      freshGraduate: !freshGraduate
    })
  }

  handleLanguageAdded(language) {
    const { actions, languages } = this.props
    actions.handleInfoChange({
      languages: [...languages, language]
    })
  }

  handleLanguageRemoved(index) {
    const { actions, languages } = this.props
    actions.handleInfoChange({
      languages: [
        ...languages.slice(0, index),
        ...languages.slice(index + 1)
      ]
    })
  }

  render() {
    const {
      name,
      email,
      phone,
      gender,
      disabled,
      location,
      intention,
      languages,
      hireAvailable,
      freshGraduate
    } = this.props

    const [prefix, suffix] = email.split('@')

    return (
      <SectionWrapper {...this.props}>
        <div className={styles.resume_piece_container}>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              value={name}
              disabled={disabled}
              placeholder={resumeTexts.name}
              className={styles.resumeFormItem}
              onChange={this.handleInfoChange('name')}
            />
            <SelectorV2
              theme="flat"
              value={gender}
              options={GENDERS}
              disabled={disabled}
              className={styles.resumeFormItem}
              onChange={this.handleInfoChange('gender')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <InputGroupV2
              style={{ width: '273px' }}
              className={styles.resumeFormItem}
              sections={[
                {
                  value: prefix || '',
                  style: { width: 60 },
                  placeholder: resumeTexts.emailPrefix,
                  onChange: val => this.handleInfoChange('email')(`${val}@${suffix || ''}`)
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
                  value: suffix || '',
                  placeholder: resumeTexts.emailSuffix,
                  style: { width: 150 },
                  onChange: val => this.handleInfoChange('email')(`${prefix || ''}@${val}`)
                }
              ]}
              theme="flat"
            />
            <Input
              type="phone"
              theme="flat"
              value={phone}
              disabled={disabled}
              className={styles.resumeFormItem}
              placeholder={resumeTexts.phone}
              onChange={this.handleInfoChange('phone')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <Input
              theme="flat"
              value={intention}
              disabled={disabled}
              className={styles.resumeFormItem}
              placeholder={resumeTexts.job}
              onChange={this.handleInfoChange('intention')}
            />
            <Input
              theme="flat"
              value={location}
              disabled={disabled}
              className={styles.resumeFormItem}
              placeholder={resumeTexts.position}
              onChange={this.handleInfoChange('location')}
            />
          </div>
          <div className={styles.resume_wrapper}>
            <Labels
              max={7}
              labels={languages}
              disabled={disabled}
              onAdd={this.handleLanguageAdded}
              introText={resumeTexts.introText}
              onDelete={this.handleLanguageRemoved}
              placeholder={`+ ${resumeTexts.languages}`}
            />
          </div>
          <div className={cx(styles.resume_wrapper, styles.rowRight)}>
            <div className={styles.resumeSwitcherWrapper}>
              {resumeTexts.freshGraduate}
              &nbsp;&nbsp;
              <Switcher
                version="v2"
                disabled={disabled}
                checked={freshGraduate}
                className={styles.resumeFormItem}
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
                className={styles.resumeFormItem}
                onChange={this.handleAvailableChange}
              />
            </div>
          </div>
        </div>
        <div />
      </SectionWrapper>
    )
  }
}

function mapStateToProps(state) {
  const { info } = state.resume
  return { ...info }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(resumeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)
