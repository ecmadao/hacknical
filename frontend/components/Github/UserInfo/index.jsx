import React from 'react'
import cx from 'classnames'
import github from 'UTILS/github'
import dateHelper from 'UTILS/date'
import SocialInfo from 'COMPONENTS/GitHub/SocialInfo'
import styles from '../styles/info_card.css'
import locales from 'LOCALES'

const githubTexts = locales('github.sections.baseInfo')

const UserInfo = (props) => {
  const { data, className } = props
  if (!data) return <div />

  const { joinedAt } = githubTexts
  return (
    <div className={cx(styles.info_card, className)}>
      <div className={styles.info_header}>
        <div className={styles.info_avator}>
          <img src={data.avatar_url} role="presentation" />
        </div>
        <div className={styles.info_user}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${github.baseUrl}/${data.login}`}
          >
            {data.name || data.login}
          </a>
          <span>
            {joinedAt.replace('%time', dateHelper.validator.fullDate(data.created_at))}
          </span>
          {data.bio ? <blockquote>{data.bio}</blockquote> : null}
        </div>
      </div>
      <SocialInfo user={data} />
    </div>
  )
}

UserInfo.defaultProps = {
  className: '',
  data: {
    bio: '',
    login: '',
    name: '',
    avatar_url: '',
    created_at: ''
  }
}

export default UserInfo
