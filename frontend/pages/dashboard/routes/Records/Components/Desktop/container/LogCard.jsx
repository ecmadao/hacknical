
import React from 'react'
import cx from 'classnames'
import {
  Loading,
  ClassicCard,
} from 'light-ui'
import styles from '../styles/records.css'
import locales from 'LOCALES'
import dateHelper from 'UTILS/date'

const { minutesBefore } = dateHelper.relative
const recordsTexts = locales('dashboard').records.common

export const LogCard = (props) => {
  const { loading, viewLogs } = props
  if (loading) return <Loading loading />

  return (
    <ClassicCard className={styles.shareCard} bgClassName={styles.shareCardBg} hoverable={false}>
      <div className={cx(styles.card, styles.cardLite)}>
        {!viewLogs.length && (
          <div className={styles.viewLog}>
            {recordsTexts.empty}
          </div>
        )}
        {viewLogs.map((viewLog, index) => (
          <div key={index} className={styles.viewLog}>
            <div className={styles.viewLogTop}>
              {viewLog.ipInfo.ip}
              &nbsp;&nbsp;
              {viewLog.platform}, {viewLog.browser}
            </div>
            <div className={styles.viewLogBottom}>
              <div className={styles.viewLogAddr}>
                {viewLog.ipInfo.addr}
              </div>
              {minutesBefore(viewLog.updatedAt)}
            </div>
          </div>
        ))}
      </div>
    </ClassicCard>
  )
}
