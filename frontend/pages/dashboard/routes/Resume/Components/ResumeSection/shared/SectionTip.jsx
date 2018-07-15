
import React from 'react';
import { Tipso } from 'light-ui';
import locales from 'LOCALES';
import styles from '../../../styles/resume.css';

const localeText = locales('resume.tips');

const getTips = (section, freshGraduate) => {
  const key = freshGraduate ? 'graduate' : 'normal';
  return localeText[section] && localeText[section][key] !== undefined
    ? localeText[section][key]
    : localeText[section];
};

const SectionTip = (props) => {
  const {
    text,
    section,
    freshGraduate,
    hideTip = false,
    theme = 'dark',
    icon = 'question-circle',
  } = props;

  if (hideTip) return null;
  const tip = text || getTips(section, freshGraduate);
  if (!tip) return null;

  return (
    <Tipso
      theme={theme}
      className={styles.section_tipso}
      tipsoContent={(<span>{tip}</span>)}
    >
      <span className={styles.section_intro}>
        <i className={`fa fa-${icon}`} aria-hidden="true" />
      </span>
    </Tipso>
  );
};

export default SectionTip;
