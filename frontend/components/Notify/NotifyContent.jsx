
import React from 'react'
import cx from 'classnames'
import { AnimationComponent } from 'light-ui'
import locales from 'LOCALES'
import API from 'API'
import styles from './notify.css'
import dateHelper from 'UTILS/date'
import { URLS } from 'UTILS/constant/github'
import { EMOJI } from 'UTILS/constant'
import { random, throttle } from 'UTILS/helper'
import Icon from 'COMPONENTS/Icon'

const getEmoji = () => {
  const keys = Object.keys(EMOJI)
  const key = random(keys)
  return EMOJI[key]
}

const emoji = getEmoji()
const notifyLocales = locales('datas.notify')
const getFullDate = dateHelper.validator.fullDate
const upvote = throttle(id => API.user.voteNotify(id, { vote: 1 }))()
const downvote = throttle(id => API.user.voteNotify(id, { vote: 0 }))()

const getHeadline = date =>
  notifyLocales.headline.replace('%s', getFullDate(date))

const renderSections = text =>
  text.split(/(?:\r\n|\r|\n)/g).map((section, index) => (
    <span key={index}>
      {section}
      <br/>
    </span>
  ))

const _NotifyContent = (props) => {
  const {
    status,
    onClose,
    messages,
    onTransitionEnd
  } = props

  const message = messages[0]
  return (
    <div
      className={cx(
        styles.notify,
        styles[`notify-${status}`]
      )}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles.close} onClick={onClose}>
        <Icon icon="close" />
      </div>
      <div className={styles.header}>
        {emoji}&nbsp;{message.headline || getHeadline(message.date)}
      </div>
      <div className={styles.content}>
        {renderSections(message.content)}
      </div>
      <div className={styles.bottom}>
        <div className={styles.operations}>
          <Icon icon="thumbs-o-up" onClick={() => upvote(message.id)} />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Icon icon="thumbs-o-down" onClick={() => downvote(message.id)} />
        </div>
        <div className={styles.bottomLink}>
          <a
            target="_blank"
            className={styles.link}
            rel="noopener noreferrer"
            href={`${URLS.ISSUE}/new`}
          >
            {notifyLocales.feedback}
          </a>
        </div>
      </div>
    </div>
  )
}

const NotifyContent = props => (
  <AnimationComponent>
    <_NotifyContent {...props} />
  </AnimationComponent>
)

export default NotifyContent
