import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Input,
  Tipso,
  Switcher,
  IconButton,
  SelectorV2,
  InputGroupV2
} from 'light-ui'
import cx from 'classnames'
import Img from 'react-image'
import Icon from 'COMPONENTS/Icon'
import Labels from 'COMPONENTS/Labels'
import Avator from 'COMPONENTS/Avator'
import resumeActions from '../../redux/actions'
import { GENDERS, DEFAULT_AVATOR } from 'UTILS/constant/resume'
import styles from '../../styles/resume.css'
import locales from 'LOCALES'
import SectionWrapper from './shared/SectionWrapper'
import AvatorModal from './AvatorModal'

const resumeTexts = locales('resume.sections.info')

class Info extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      avatorModal: false
    }

    this.handleAvatorChange = this.handleAvatorChange.bind(this)
    this.handleAvatorModalToggle = this.handleAvatorModalToggle.bind(this)

    this.handleInfoChange = this.handleInfoChange.bind(this)
    this.handleSwitchChange = this.handleSwitchChange.bind(this)

    this.handleLanguageAdded = this.handleLanguageAdded.bind(this)
    this.handleLanguageRemoved = this.handleLanguageRemoved.bind(this)
    this.handleLanguageReorder = this.handleLanguageReorder.bind(this)
  }

  handleAvatorModalToggle(toggle) {
    return () => {
      this.setState({
        avatorModal: toggle
      })
    }
  }

  handleAvatorChange(avator, modalOpen = false) {
    const { actions } = this.props
    actions.handleInfoChange({
      avator
    })
    this.handleAvatorModalToggle(modalOpen)()
  }

  handleInfoChange(type) {
    const { actions } = this.props
    return (value) => {
      actions.handleInfoChange({
        [type]: value
      })
    }
  }

  handleSwitchChange(key) {
    return () => {
      const { actions } = this.props
      actions.handleInfoChange({
        [key]: !this.props[key]
      })
    }
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

  handleLanguageReorder(languages) {
    const { actions } = this.props
    actions.handleInfoChange({
      languages: [
        ...languages
      ]
    })
  }

  render() {
    const {
      name,
      email,
      phone,
      gender,
      avator,
      disabled,
      location,
      intention,
      languages,
      hireAvailable,
      freshGraduate,
      privacyProtect
    } = this.props
    const { avatorModal } = this.state
    const [prefix, suffix] = email.split('@')

    return (
      <SectionWrapper {...this.props}>
        <div className={styles.resume_piece_container}>
          <div className={styles.resume_wrapper}>
            <Tipso
              theme="dark"
              trigger="hover"
              className={styles.avatorTipso}
              tipsoContent={(<span>{resumeTexts.avator.intro}</span>)}
            >
              <div onClick={this.handleAvatorModalToggle(true)}>
                <Avator
                  src={avator}
                  className={styles.avator}
                  unloader={
                    <Img className={styles.avatorPlaceholder} src={DEFAULT_AVATOR} crossOrigin="anonymous" />
                  }
                />
              </div>
            </Tipso>
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
            <div className={styles.phoneWrapper}>
              <Input
                type="phone"
                theme="flat"
                value={phone}
                disabled={disabled}
                className={cx(styles.resumeFormItem, styles.phoneInput)}
                placeholder={resumeTexts.phone}
                onChange={this.handleInfoChange('phone')}
              />
              <Tipso
                theme="dark"
                wrapperClass={styles.phoneTipWarpper}
                tipsoContent={(
                  <span>
                    {privacyProtect
                      ? resumeTexts.privacyProtect.enabled
                      : resumeTexts.privacyProtect.disabled
                    }
                  </span>
                )}
              >
                <IconButton
                  color="gray"
                  className={styles.phoneVisiable}
                  icon={privacyProtect ? 'eye-slash' : 'eye'}
                  onClick={this.handleSwitchChange('privacyProtect')}
                />
              </Tipso>
            </div>
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
              onReorder={this.handleLanguageReorder}
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
                onChange={this.handleSwitchChange('freshGraduate')}
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
                onChange={this.handleSwitchChange('hireAvailable')}
              />
            </div>
          </div>
        </div>
        <div />
        {avatorModal && (
          <AvatorModal
            openModal={avatorModal}
            imageUrl={avator}
            onClose={this.handleAvatorModalToggle(false)}
            onSubmit={this.handleAvatorChange}
          />
        )}
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
