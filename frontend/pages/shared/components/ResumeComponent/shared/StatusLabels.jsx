import React from 'react';
import { Label } from 'light-ui';
import styles from './status_labels.css';
import dateHelper from 'UTILS/date';

const getSecondsByDate = dateHelper.seconds.getByDate;
const getDateNow = dateHelper.date.now;

const DATE_NOW = getDateNow();
const DATE_NOW_SECONDS = getSecondsByDate(DATE_NOW);

const StatusLabels = (options = {}) => {
  const {
    resumeInfo,
    educations,
    workExperiences,
    labelColor = 'light',
  } = options;
  const labels = [];
  if (resumeInfo.hireAvailable) {
    labels.push(
      <Label
        min
        key={0}
        text="求职中"
        clickable={false}
        color={labelColor}
        className={styles.info_label}
      />
    );
  }
  if (educations.length) {
    const lastEducation = educations[0];
    const eduEndTime = lastEducation.endTime;
    if (getSecondsByDate(eduEndTime) >= DATE_NOW_SECONDS) {
      labels.push(
        <Label
          min
          key={0}
          text="在校"
          clickable={false}
          color={labelColor}
          className={styles.info_label}
        />
      );
    }
  }
  if (workExperiences.length) {
    const lastWorkExperience = workExperiences[0];
    const untilNow = lastWorkExperience.untilNow;
    if (untilNow) {
      labels.push(
        <Label
          min
          key={1}
          text="在职"
          clickable={false}
          color={labelColor}
          className={styles.info_label}
        />
      );
    }
  }

  if (labels.length) {
    return (
      <div className={styles.info_labels_container}>
        {labels}
      </div>
    );
  }
};

export default StatusLabels;
