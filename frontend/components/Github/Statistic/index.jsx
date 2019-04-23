import React from 'react'
import deepcopy from 'deepcopy'
import Chart from 'chart.js'
import styles from '../styles/statistic.css'
import githubStyles from '../styles/github.css'
import cardStyles from '../styles/info_card.css'
import locales from 'LOCALES'
import { Loading } from 'light-ui'
import { RADAR_CONFIG } from 'UTILS/constant/chart'

const githubTexts = locales('github.sections')

class Statistic extends React.Component {
  constructor(props) {
    super(props)
    this.starredLanguagesChart = null
    this.starredKeywordsChart = null
  }

  componentDidUpdate() {
    const { statistic } = this.props
    if (statistic) {
      const { starred } = statistic
      !this.starredLanguagesChart && this.renderRadarChart({
        data: starred.languages,
        ref: this.starredLanguages,
        pointTo: 'starredLanguagesChart',
        title: githubTexts.statistic.languageChartTitle
      })
      !this.starredKeywordsChart && this.renderRadarChart({
        data: starred.keywords,
        ref: this.starredKeywords,
        pointTo: 'starredKeywordsChart',
        title: githubTexts.statistic.keywordsChartTitle
      })
    }
  }

  renderRadarChart(options = {}) {
    const {
      ref,
      data,
      title,
      pointTo
    } = options

    const labels = Object.keys(data)
    const sum = labels.reduce((pre, next) => pre + data[next], 0)
    const datas = labels.map(label => (data[label] / sum).toFixed(2))

    const radarConfig = deepcopy(RADAR_CONFIG)
    radarConfig.data.labels = labels
    radarConfig.data.datasets[0].data = datas
    radarConfig.options.title.text = title

    this[pointTo] = new Chart(ref, radarConfig)
  }

  render() {
    const { loaded, statistic } = this.props
    let component = null

    if (loaded && !statistic) {
      component = (
        <div className={cardStyles.empty_card}>
          {githubTexts.statistic.emptyText}
        </div>
      )
    } else {
      component = (
        <div className={styles.container}>
          <Loading className={githubStyles.loading} loading={!loaded} />
          <div className={styles.section}>
            <canvas
              className={styles.radarChart}
              ref={ref => (this.starredLanguages = ref)}
            />
          </div>
          <div className={styles.sectionLine} />
          <div className={styles.section}>
            <canvas
              className={styles.radarChart}
              ref={ref => (this.starredKeywords = ref)}
            />
          </div>
        </div>
      )
    }
    return (
      <div className={styles.wrapper}>
        {component}
      </div>
    )
  }
}

export default Statistic
