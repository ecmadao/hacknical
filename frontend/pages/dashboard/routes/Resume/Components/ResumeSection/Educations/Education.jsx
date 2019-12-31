
import React from 'react'
import cx from 'classnames'
import { Input, IconButton, SelectorV2 } from 'light-ui'
import WritableList from 'COMPONENTS/WritableList'
import DateSlider from 'COMPONENTS/DateSlider'
import dateHelper from 'UTILS/date'
import { EDUCATIONS } from 'UTILS/constant/resume'
import styles from '../../../styles/resume.css'
import locales from 'LOCALES'
import API from 'API'

const resumeTexts = locales('resume.sections.educations')

class Education extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      types: []
    }

    this.addExperience = this.addExperience.bind(this)
    this.deleteExperience = this.deleteExperience.bind(this)
    this.changeExperience = this.changeExperience.bind(this)
    this.onDateChange = this.onDateChange.bind(this)

    this.handleSchoolInfoFetch = this.handleSchoolInfoFetch.bind(this)
  }

  componentDidMount() {
    this.handleSchoolInfoFetch()
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

  async handleSchoolInfoFetch() {
    const { edu } = this.props
    const { school } = edu

    const info = await API.resume.getSchoolInfo({ school })
    info && this.setState({
      types: info.types
    })
  }

  render() {
    const {
      edu,
      index,
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
    const { types } = this.state

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
            onBlur={this.handleSchoolInfoFetch}
            className={cx(styles.single_input, styles.resumeFormItem)}
          />
          {types.length ? (
            <div className={styles.schoolTypes}>
              {types.map((schoolType, i) => (
                <div className={styles.schoolType} key={i}>{schoolType}</div>
              ))}
            </div>
          ) : null}
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
              name={`Education-${index}`}
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
