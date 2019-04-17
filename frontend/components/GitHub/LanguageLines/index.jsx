
import React from 'react'
import cx from 'classnames'
import locales from 'LOCALES'
import github from 'UTILS/github'
import { randomColor } from 'UTILS/colors'
import styles from './line.css'

const getRamdomColor = randomColor('LanguageLines')
const githubTexts = locales('github.sections.languages')

const LanguageLines = (props) => {
  const {
    loaded,
    languages,
    languageUsed,
    dynamicOpacity,
    showCount = 9,
    className = ''
  } = props
  if (!loaded) return null

  let datas = languages
  if (!datas || Object.keys(datas).length === 0) datas = languageUsed

  const languagesList = Object.keys(datas)
    .sort(github.sortByLanguage(datas))
    .slice(0, showCount)
  const total = languagesList.reduce((num, lang) => datas[lang] + num, 0)

  if (!languagesList.length) return null

  // const maxUsedCounts = datas[languagesList[0]]
  const languagesCount = languagesList.length

  const lines = languagesList.map((language, index) => {
    const color = getRamdomColor(language)
    const style = {
      backgroundColor: color,
      opacity: dynamicOpacity
        ? `${(languagesCount - index) / languagesCount}`
        : 1
    }
    const barStyle = {
      width: `${((datas[language] * 100) / total).toFixed(3)}%`
    }
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
    )
  })

  return (
    <div className={cx(styles.reposWrapper, className)}>
      <div className={styles.reposXAxes}>
        <div className={styles.xAxesText}>
          {githubTexts.frequencyPercentage}
        </div>
      </div>
      <div className={styles.reposContentsWrapper}>
        <div className={styles.reposContents}>
          {lines}
        </div>
        <div className={styles.reposYAxes}>
          <div className={styles.yAxesText}>
            {githubTexts.frequency}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LanguageLines
