import React from 'react'
import cx from 'classnames'
import Icon from 'COMPONENTS/Icon'
import styles from '../styles/modal.css'

const ReposCard = (props) => {
  const { repository, pinned, onRemove, onPinned } = props
  const { name, stargazers_count, language } = repository
  const onClick = pinned ? () => onRemove(name) : () => onPinned(name)
  const reposClass = cx(
    styles.repository,
    pinned && styles.active
  )

  return (
    <div
      onClick={onClick}
      className={reposClass}
    >
      <div className={styles.repos_header}>{name}</div>
      <div className={styles.repos_bottom}>
        <div className={styles.bottom_section}>
          {`<${language}>`}
        </div>
        <div
          className={cx(
            styles.bottom_section,
            parseInt(stargazers_count, 10) > 5 && styles.section_active
          )}
        >
          <Icon icon="star" />
          &nbsp;
          {stargazers_count}
        </div>
      </div>
    </div>
  )
}

export default ReposCard
