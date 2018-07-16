
import React from 'react';
import cx from 'classnames';
import locales from 'LOCALES';
import github from 'UTILS/github';
import { randomColor } from 'UTILS/colors';
import styles from './line.css';

const getRamdomColor = randomColor('LanguageLines');
const githubTexts = locales('github.sections');

const LanguageLines = (props) => {
  const {
    loaded,
    languages,
    languageUsed,
    className = '',
    dynamicOpacity
  } = props;
  if (!loaded) return null;

  let datas = languages;
  if (!datas || Object.keys(datas).length === 0) datas = languageUsed;

  const languagesList = Object.keys(datas)
    .sort(github.sortByLanguage(datas))
    .slice(0, 9);

  const maxUsedCounts = datas[languagesList[0]];
  const languagesCount = languagesList.length;

  const lines = languagesList.map((language, index) => {
    const color = getRamdomColor(language);
    const style = {
      backgroundColor: color,
      opacity: dynamicOpacity ? `${(languagesCount - index) / languagesCount}` : 1,
    };
    const barStyle = {
      width: `${((datas[language] * 100) / maxUsedCounts).toFixed(2)}%`
    };
    return (
      <div className={styles.reposItem} key={index}>
        <div
          style={barStyle}
          className={styles.itemChart}
        >
          <div
            style={style}
            className={styles.commitBar}
          />
        </div>
        <div className={styles.itemData}>
          {language}
        </div>
      </div>
    );
  });

  return (
    <div className={cx(styles.reposWrapper, className)}>
      <div className={styles.reposContentsWrapper}>
        <div className={styles.reposContents}>
          {lines}
        </div>
        <div className={styles.reposYAxes}>
          <div className={styles.yAxesText}>
            {githubTexts.languages.frequency}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageLines;
