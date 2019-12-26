
import React from 'react'
import cx from 'classnames'
import {
  Tipso,
  Label,
  Loading,
  ClassicCard,
} from 'light-ui'
import styles from '../styles/records.css'
import locales from 'LOCALES'
import dateHelper from 'UTILS/date'

const { minutesBefore } = dateHelper.relative
const recordsTexts = locales('dashboard').records.common

const LogTipso = props => (
  <div className={styles.logTipso}>
    <div className={styles.logTipsoMain}>
      {props.log.platform}, {props.log.browser}
    </div>
    <div className={styles.logTipsoSub}>
      {props.log.datetime}
    </div>
  </div>
)

export const LogCard = (props) => {
  const { loading, viewLogs } = props
  if (loading) return <Loading loading />

  return (
    <ClassicCard
      hoverable={false}
      className={styles.shareCard}
      bgClassName={cx(
        styles.shareCardBg,
        styles.logsCardBg
      )}
    >
      <div className={cx(styles.card, styles.cardLite)}>
        {!viewLogs.length && (
          <div className={styles.viewLog}>
            {recordsTexts.empty}
          </div>
        )}
        {viewLogs.map((viewLog, index) => (
          <div key={index} className={styles.viewLog}>
            <div className={styles.viewLogTop}>
              <div className={styles.viewRow}>
                {viewLog.ip}
                &nbsp;&nbsp;
                {viewLog.platform}, {viewLog.browser}
              </div>
              <Tipso
                theme="dark"
                trigger="click"
                tipsoContent={(
                  <div className={styles.logTipsoContainer}>
                    {viewLog.data.map((logData, index) => (
                      <LogTipso log={logData} key={index} />
                    ))}
                  </div>
                )}
              >
                <div>
                  <Label
                    min
                    color="dark"
                    text={`${viewLog.data.length}`}
                  />
                </div>
              </Tipso>
            </div>
            <div className={styles.viewLogBottom}>
              <div className={styles.viewRow}>
                {viewLog.addr}
              </div>
              {minutesBefore(viewLog.datetime)}
            </div>
          </div>
        ))}
      </div>
    </ClassicCard>
  )
}
