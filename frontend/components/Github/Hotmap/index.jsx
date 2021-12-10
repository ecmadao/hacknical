/* eslint new-cap: "off" */

import React from 'react'
import cx from 'classnames'
import CalHeatMap from 'cal-heatmap'
import 'cal-heatmap/cal-heatmap.css'
import { Loading, InfoCard, CardGroup } from 'light-ui'
import styles from '../styles/github.css'
import cardStyles from '../styles/info_card.css'
import locales, { formatLocale } from 'LOCALES'
import dateHelper from 'UTILS/date'
import Icon from 'COMPONENTS/Icon'

const githubTexts = locales('github.sections.hotmap')

class Hotmap extends React.Component {
  constructor(props) {
    super(props)
    this.githubCalendar = false
  }

  componentDidUpdate() {
    if (!this.githubCalendar && $('#cal-heatmap')[0]) {
      this.renderHotmap()
    }
  }

  renderHotmap() {
    const { loaded, data } = this.props
    if (!loaded) return

    this.githubCalendar = true
    const local = formatLocale()
    const cal = new CalHeatMap()
    const {
      datas,
      levelRanges
    } = (data || {})

    cal.init({
      domain: 'month',
      start: new Date(dateHelper.date.beforeYears(1)),
      data: datas,
      weekStartOnMonday: local === 'zh-CN',
      subDomain: 'day',
      range: 13,
      displayLegend: false,
      previousSelector: '#hotmap-left',
      nextSelector: '#hotmap-right',
      legend: levelRanges,
      domainLabelFormat: '%Y-%m',
      legendColors: {
        min: '#dae289',
        max: '#3b6427',
        empty: '#ededed'
      }
    })
  }

  renderCardGroup() {
    const { renderCards, data } = this.props
    if (!data || !data.datas || !renderCards) return null
    const {
      end,
      start,
      total,
      streak,
    } = data

    return (
      <CardGroup
        className={cx(
          cardStyles.card_group,
          styles.hotmapCards
        )}
      >
        <CardGroup>
          <InfoCard
            icon="terminal"
            tipsoTheme="dark"
            mainText={total}
            subText={githubTexts.total}
            tipso={{
              text: `${start} ~ ${end}`
            }}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={`${streak.weekly.start}~${streak.weekly.end}`}
            subText={githubTexts.weekly}
            tipso={{
              text: `Totally ${streak.weekly.count} commits`
            }}
          />
        </CardGroup>
        <CardGroup>
          <InfoCard
            tipsoTheme="dark"
            mainText={streak.daily.date}
            subText={githubTexts.daily}
            tipso={{
              text: `${streak.daily.count} commits`
            }}
          />
          <InfoCard
            icon="thumb-tack"
            tipsoTheme="dark"
            mainText={streak.longest.count}
            subText={githubTexts.longestStreak}
            tipso={{
              text: streak.longest.start
                ? `${streak.longest.start} ~ ${streak.longest.end}`
                : githubTexts.streakError
            }}
          />
          <InfoCard
            tipsoTheme="dark"
            mainText={streak.current.count}
            subText={githubTexts.currentStreak}
            tipso={{
              text: streak.current.start
                ? `${streak.current.start} ~ ${streak.current.end}`
                : githubTexts.streakError
            }}
          />
        </CardGroup>
      </CardGroup>
    )
  }

  render() {
    const { className, loaded } = this.props

    return (
      <div
        className={cx(
          styles.githubCalendar,
          className
        )}
      >
        <Loading className={styles.loading} loading={!loaded} />
        <div id="cal-heatmap" className={styles.githubHotmap} />
        <div className={styles.hotmapControllers}>
          <div className={styles.hotmapController} id="hotmap-left">
            <Icon icon="angle-left" />
          </div>
          <div className={styles.hotmapController} id="hotmap-right">
            <Icon icon="angle-right" />
          </div>
        </div>
        {this.renderCardGroup()}
      </div>
    )
  }
}

Hotmap.defaultProps = {
  login: '',
  className: '',
  renderCards: true,
  data: {
    end: '',
    start: '',
    total: '',
    streak: '',
    datas: [],
    levelRanges: []
  }
}

export default Hotmap
