import React from 'react'
import cx from 'classnames'
import { IconButton, InputGroup, InputGroupV2, Input } from 'light-ui'
import DateSlider from 'COMPONENTS/DateSlider'
import Icon from 'COMPONENTS/Icon'
import WorkProject from './WorkProject'
import styles from '../../../styles/resume.css'
import locales from 'LOCALES'

const resumeTexts = locales('resume.sections.workExperiences')

class WorkExperience extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startOpen: false,
      endOpen: false
    }
    this.handleStartFocus = this.handleStartFocus.bind(this)
    this.handleEndFocus = this.handleEndFocus.bind(this)
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this)
  }

  handleStartFocus({ focused: startOpen }) {
    this.setState({ startOpen })
  }

  handleEndFocus({ focused: endOpen }) {
    this.setState({ endOpen })
  }

  handleEndTimeChange(endTime, untilNow = false) {
    const { handleExperienceChange } = this.props
    handleExperienceChange('endTime')(endTime)
    handleExperienceChange('untilNow')(untilNow)
  }

  renderWorkProjects(projects) {
    const { handleProjectChange, deleteProject, disabled } = this.props
    return projects.map((project, index) => (
      <WorkProject
        key={index}
        project={project}
        disabled={disabled}
        onDelete={deleteProject(index)}
        onChange={handleProjectChange(index)}
      />
    ))
  }

  render() {
    const {
      disabled,
      addProject,
      workExperience,
      deleteExperience,
      handleExperienceChange,
    } = this.props
    const {
      url,
      endTime,
      projects,
      untilNow,
      company,
      position,
      startTime,
    } = workExperience

    return (
      <div className={styles.resume_piece_container}>
        <div className={styles.section_second_title}>
          {resumeTexts.companyInfo}
        </div>
        <div className={styles.resume_wrapper}>
          <InputGroup
            theme="flat"
            value={company}
            disabled={disabled}
            inputClassName={cx(styles.inputGroup, styles.resumeFormItem)}
            wrapperClassName={styles.inputTipsoWrapper}
            placeholder={resumeTexts.companyName}
            onChange={handleExperienceChange('company')}
          >
            <InputGroupV2
              sections={[
                {
                  value: 'http://',
                  disabled: true,
                  style: {
                    width: 50,
                    padding: '0 5px'
                  }
                },
                {
                  disabled,
                  type: 'url',
                  value: url ? url.replace(/^https?:\/\//, '') : '',
                  placeholder: resumeTexts.homepage,
                  onChange: handleExperienceChange('url'),
                }
              ]}
              style={{
                margin: 0
              }}
              theme="underline"
              className={styles.resumeFormItem}
            />
          </InputGroup>
          <Input
            theme="flat"
            value={position}
            disabled={disabled}
            placeholder={resumeTexts.position}
            className={cx(styles.last_input, styles.resumeFormItem)}
            onChange={handleExperienceChange('position')}
          />
          <IconButton
            color="red"
            icon="trash-o"
            className={styles.resume_delete}
            onClick={deleteExperience}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <DateSlider
            initialStart={startTime}
            initialEnd={untilNow ? null : endTime}
            startText={resumeTexts.entriedAt}
            endText={resumeTexts.dimissionAt}
            onStartChange={handleExperienceChange('startTime')}
            onEndChange={this.handleEndTimeChange}
          />
        </div>
        <div className={styles.project_wrapper}>
          <div className={styles.section_second_title}>
            {resumeTexts.joinedProjects}
          </div>
          {this.renderWorkProjects(projects)}
          <div
            className={styles.resume_add}
            onClick={addProject}
          >
            <Icon icon="plus-circle" />
            &nbsp;&nbsp;&nbsp;
            {resumeTexts.sideButton}
          </div>
        </div>
      </div>
    )
  }
}

export default WorkExperience
