
import React from 'react';
import { Tipso } from 'light-ui';
import locales from 'LOCALES';
import styles from '../../../styles/resume.css';

// TODO: add en version
const TIPS = {
  educations: {
    graduate: '应届生可能没有很多的经验，可以用学校和在校经历弥补',
    normal: ''
  },
  workExperiences: {
    graduate: '有相关实习经历是再好不过了，但还请牢记“宁缺毋滥”',
    normal: '突出重点项目，按时间从近到远，和职位需求匹配度高低来决定自己书写的重点'
  },
  personalProjects: '个人项目可以侧面展现自己的学习能力和职业发展路线',
  others: '太基础的技能就不用强调了。正确书写技术名词，切记请勿随意“精通”'
};

const getTips = (section, freshGraduate) => {
  const key = freshGraduate ? 'graduate' : 'normal';
  return TIPS[section] && TIPS[section][key] !== undefined ? TIPS[section][key] : TIPS[section];
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
