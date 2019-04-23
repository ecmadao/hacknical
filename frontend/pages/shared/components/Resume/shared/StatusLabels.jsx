import React from 'react'
import { Label } from 'light-ui'
import styles from './status_labels.css'
import dateHelper from 'UTILS/date'
import locales from 'LOCALES'

const resumeLocales = locales('resume')
const resumeLabels = resumeLocales.labels
const getSecondsByDate = dateHelper.seconds.getByDate
const getDateNow = dateHelper.date.now
const DATE_NOW = getDateNow()
const DATE_NOW_SECONDS = getSecondsByDate(DATE_NOW)

const StatusLabels = (options = {}) => {
  const {
    resumeInfo,
    educations,
    workExperiences,
    labelColor = 'light'
  } = options
  const labels = []
  if (resumeInfo.freshGraduate) {
    labels.push(
      <Label
        min
        key="freshGraduate"
        text={resumeLabels.freshGraduate}
        clickable={false}
        color={labelColor}
        className={styles.info_label}
      />
    )
  }
  if (resumeInfo.hireAvailable) {
    labels.push(
      <Label
        min
        key="hireAvailable"
        text={resumeLabels.hireAvailable}
        clickable={false}
        color={labelColor}
        className={styles.info_label}
      />
    )
  }
  if (educations.length) {
    const lastEducation = educations[0]
    const eduEndTime = lastEducation.endTime
    if (getSecondsByDate(eduEndTime) >= DATE_NOW_SECONDS) {
      labels.push(
        <Label
          min
          key="atSchool"
          text={resumeLabels.atSchool}
          clickable={false}
          color={labelColor}
          className={styles.info_label}
        />
      )
    }
  }
  if (workExperiences.length) {
    const lastWorkExperience = workExperiences[0]
    const untilNow = lastWorkExperience.untilNow
    if (untilNow) {
      labels.push(
        <Label
          min
          key="atWork"
          text={resumeLabels.atWork}
          clickable={false}
          color={labelColor}
          className={styles.info_label}
        />
      )
    }
  }

  if (labels.length) {
    return (
      <div className={styles.info_labels_container}>
        {labels}
      </div>
    )
  } else {
    return null
  }
}

export default StatusLabels
