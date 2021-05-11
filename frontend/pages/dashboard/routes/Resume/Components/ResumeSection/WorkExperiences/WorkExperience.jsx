import React from 'react'
import cx from 'classnames'
import { IconButton, InputGroup, InputGroupV2, Input } from 'light-ui'
import DateSlider from 'COMPONENTS/DateSlider'
import DragAndDrop from 'COMPONENTS/DragAndDrop'
import Icon from 'COMPONENTS/Icon'
import Labels from 'COMPONENTS/Labels'
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
    this.handleTechAdded = this.handleTechAdded.bind(this)
    this.handleTechRemoved = this.handleTechRemoved.bind(this)
    this.handleTechReorder = this.handleTechReorder.bind(this)
  }

  handleTechAdded(tech) {
    const { handleExperienceChanged, workExperience } = this.props
    const { techs = [] } = workExperience
    handleExperienceChanged('techs')([...techs, tech])
  }

  handleTechRemoved(techIndex) {
    const { handleExperienceChanged, workExperience } = this.props
    const { techs = [] } = workExperience
    handleExperienceChanged('techs')([
      ...techs.splice(0, techIndex),
      ...techs.splice(techIndex + 1)
    ])
  }

  handleTechReorder(techs) {
    const { handleExperienceChanged } = this.props
    handleExperienceChanged('techs')([...techs])
  }

  handleStartFocus({ focused: startOpen }) {
    this.setState({ startOpen })
  }

  handleEndFocus({ focused: endOpen }) {
    this.setState({ endOpen })
  }

  handleEndTimeChange(endTime, untilNow = false) {
    const { handleExperienceChanged } = this.props
    handleExperienceChanged('endTime')(endTime)
    handleExperienceChanged('untilNow')(untilNow)
  }

  renderWorkProjects(projects) {
    const {
      id,
      disabled,
      handleProjectChanged,
      handleProjectRemoved,
      handleProjectDetailReorder,
      handleExperienceReorder,
    } = this.props

    return (
      <DragAndDrop onDragEnd={handleExperienceReorder}>
        {projects.map((project, i) => ({
          id: project.id,
          Component: (
            <WorkProject
              key={`${id}.Project.${i}`}
              id={`${id}.Project.${i}`}
              project={project}
              disabled={disabled}
              onDelete={handleProjectRemoved(i)}
              onChange={handleProjectChanged(i)}
              onReorder={handleProjectDetailReorder(i)}
            />
          )
        }))}
      </DragAndDrop>
    )
  }

  render() {
    const {
      isLast,
      disabled,
      workExperience,
      handleProjectAdded,
      handleExperienceAdded,
      handleExperienceRemoved,
      handleExperienceChanged,
    } = this.props
    const {
      url,
      endTime,
      projects,
      untilNow,
      company,
      position,
      startTime,
      techs = []
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
            onChange={handleExperienceChanged('company')}
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
                  onChange: handleExperienceChanged('url'),
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
            onChange={handleExperienceChanged('position')}
          />
          <IconButton
            color="red"
            icon="trash-o"
            className={styles.resume_delete}
            onClick={handleExperienceRemoved}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <DateSlider
            initialStart={startTime}
            initialEnd={untilNow ? null : endTime}
            startText={resumeTexts.entriedAt}
            endText={resumeTexts.dimissionAt}
            onStartChange={handleExperienceChanged('startTime')}
            onEndChange={this.handleEndTimeChange}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <Labels
            max={7}
            labels={techs}
            disabled={disabled}
            introText={resumeTexts.techIntroText}
            className={styles.resume_work_techs}
            onAdd={this.handleTechAdded}
            onDelete={this.handleTechRemoved}
            onReorder={this.handleTechReorder}
            placeholder={`+ ${resumeTexts.technologies}`}
          />
        </div>
        <div className={styles.project_wrapper}>
          <div className={styles.section_second_title}>
            {resumeTexts.joinedProjects}
          </div>
          {this.renderWorkProjects(projects)}
          <div
            className={styles.resume_add}
            onClick={handleProjectAdded}
          >
            <Icon icon="plus-circle" />
            &nbsp;&nbsp;&nbsp;
            {resumeTexts.sideButton}
          </div>
        </div>
        {!isLast && (
          <div className={styles.resume_piece_add} onClick={handleExperienceAdded}>
            <Icon icon="plus-circle" />
          </div>
        )}
      </div>
    )
  }
}

export default WorkExperience
