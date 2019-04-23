
import React from 'react'
import cx from 'classnames'
import { Input, IconButton, SelectorV2 } from 'light-ui'
import WritableList from 'COMPONENTS/WritableList'
import DateSlider from 'COMPONENTS/DateSlider'
import dateHelper from 'UTILS/date'
import { EDUCATIONS } from 'UTILS/constant/resume'
import styles from '../../../styles/resume.css'
import locales from 'LOCALES'

const resumeTexts = locales('resume.sections.educations')

class Education extends React.Component {
  constructor(props) {
    super(props)

    this.addExperience = this.addExperience.bind(this)
    this.deleteExperience = this.deleteExperience.bind(this)
    this.changeExperience = this.changeExperience.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
  }

  onDateChange(type) {
    const { handleChange } = this.props
    return (momentTime) => {
      const time = momentTime.format('L')
      handleChange && handleChange(type)(time)
    }
  }

  addExperience(experience) {
    const { edu, handleChange } = this.props
    const { experiences = [] } = edu
    handleChange('experiences')([...experiences, experience])
  }

  deleteExperience(index) {
    const { edu, handleChange } = this.props
    const { experiences } = edu
    handleChange('experiences')(
      [...experiences.slice(0, index), ...experiences.slice(index + 1)]
    )
  }

  changeExperience(experience, index) {
    const { edu, handleChange } = this.props
    const { experiences } = edu
    handleChange('experiences')(
      [
        ...experiences.slice(0, index),
        experience,
        ...experiences.slice(index + 1)
      ]
    )
  }

  render() {
    const {
      edu,
      disabled,
      handleDelete,
      freshGraduate,
      handleChange,
    } = this.props
    const {
      major,
      school,
      endTime,
      education,
      startTime,
      experiences = []
    } = edu

    return (
      <div className={styles.resume_piece_container}>
        <div className={styles.resume_wrapper}>
          <IconButton
            color="red"
            icon="trash-o"
            onClick={handleDelete}
            className={styles.resume_delete}
          />
          <Input
            theme="flat"
            value={school}
            disabled={disabled}
            placeholder={resumeTexts.school}
            onChange={handleChange('school')}
            className={cx(styles.single_input, styles.resumeFormItem)}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <Input
            theme="flat"
            value={major}
            disabled={disabled}
            placeholder={resumeTexts.major}
            onChange={handleChange('major')}
            className={styles.resumeFormItem}
          />
          <SelectorV2
            theme="flat"
            value={education}
            disabled={disabled}
            options={EDUCATIONS}
            onChange={handleChange('education')}
            className={styles.resumeFormItem}
          />
        </div>
        <div className={styles.resume_wrapper}>
          <DateSlider
            pushInterval="year"
            initialEnd={endTime}
            initialStart={startTime}
            endText={resumeTexts.graduateAt}
            startText={resumeTexts.entranceAt}
            maxDate={dateHelper.date.afterYears(5)}
            onStartChange={handleChange('startTime')}
            onEndChange={handleChange('endTime')}
          />
        </div>
        {freshGraduate ? (
          <div className={styles.resume_wrapper}>
            <WritableList
              items={experiences}
              onAdd={this.addExperience}
              onDelete={this.deleteExperience}
              onChange={this.changeExperience}
              introList={resumeTexts.introList}
              defaultIntro={resumeTexts.introText}
              placeholder={resumeTexts.addEduExperience}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

export default Education
