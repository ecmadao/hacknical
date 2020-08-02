
import React from 'react'
import cx from 'classnames'
import { Input, IconButton, SelectorV2 } from 'light-ui'
import WritableList from 'COMPONENTS/WritableList'
import DateSlider from 'COMPONENTS/DateSlider'
import Icon from 'COMPONENTS/Icon'
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
    this.reorderExperiences = this.reorderExperiences.bind(this)
    this.onDateChange = this.onDateChange.bind(this)

    this.handleSchoolInfoFetch = this.handleSchoolInfoFetch.bind(this)
  }

  componentDidMount() {
    this.handleSchoolInfoFetch()
  }

  onDateChange(type) {
    const { handleEduChanged } = this.props
    return (momentTime) => {
      const time = momentTime.format('L')
      handleEduChanged && handleEduChanged(type)(time)
    }
  }

  addExperience(experience) {
    const { edu, handleEduChanged } = this.props
    const { experiences = [] } = edu
    handleEduChanged('experiences')([...experiences, experience])
  }

  deleteExperience(experienceIndex) {
    const { edu, handleEduChanged } = this.props
    const { experiences } = edu
    handleEduChanged('experiences')(
      [...experiences.slice(0, experienceIndex), ...experiences.slice(experienceIndex + 1)]
    )
  }

  reorderExperiences(order) {
    const { edu, handleEduChanged } = this.props
    const { experiences } = edu

    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return

    const [experience] = experiences.splice(fromIndex, 1)
    experiences.splice(toIndex, 0, experience)

    handleEduChanged('experiences')([...experiences])
  }

  changeExperience(experience, experienceIndex) {
    const { edu, handleEduChanged } = this.props
    const { experiences } = edu
    handleEduChanged('experiences')(
      [
        ...experiences.slice(0, experienceIndex),
        experience,
        ...experiences.slice(experienceIndex + 1)
      ]
    )
  }

  async handleSchoolInfoFetch() {
    const { edu } = this.props

    if (edu && edu.school) {
      const info = await API.resume.getSchoolInfo({ school: edu.school })
      info && this.setState({
        types: info.types
      })
    }
  }

  render() {
    const {
      id,
      edu,
      isLast,
      disabled,
      freshGraduate,
      handleEduAdded,
      handleEduChanged,
      handleEduRemoved,
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
            onClick={handleEduRemoved}
            className={styles.resume_delete}
          />
          <Input
            theme="flat"
            value={school}
            disabled={disabled}
            placeholder={resumeTexts.school}
            onChange={handleEduChanged('school')}
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
            onChange={handleEduChanged('major')}
            className={styles.resumeFormItem}
          />
          <SelectorV2
            theme="flat"
            value={education}
            disabled={disabled}
            options={EDUCATIONS}
            onChange={handleEduChanged('education')}
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
            onStartChange={handleEduChanged('startTime')}
            onEndChange={handleEduChanged('endTime')}
          />
        </div>
        {freshGraduate ? (
          <div className={styles.resume_wrapper}>
            <WritableList
              id={id}
              items={experiences}
              name={`WritableList-${id}`}
              onAdd={this.addExperience}
              onDelete={this.deleteExperience}
              onChange={this.changeExperience}
              introList={resumeTexts.introList}
              defaultIntro={resumeTexts.introText}
              placeholder={resumeTexts.addEduExperience}
              reorderList={this.reorderExperiences}
            />
          </div>
        ) : null}
        {!isLast && (
          <div className={styles.resume_piece_add} onClick={handleEduAdded}>
            <Icon icon="plus-circle" />
          </div>
        )}
      </div>
    )
  }
}

export default Education
