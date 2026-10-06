import React from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/highstock'
import update from 'immutability-helper'
import roundedCorner from './roundedCorner'
import styles from './styles.css'

class StockChart extends React.PureComponent {
  constructor() {
    super()
    this.highstock = null
    this.renderTimer = null
  }

  componentDidMount() {
    this.renderChart()
  }

  componentDidUpdate(preProps) {
    const { data, tag } = this.props
    if (
      data.length !== preProps.data.length
      || tag !== preProps.tag
    ) this.renderChart()
  }

  renderChart() {
    // There is no useful axis to render without valid points. This also
    // prevents Highstock from entering its tick calculation with an empty
    // or malformed series.
    const series = this.props.config.series || []
    const points = series.reduce((count, item) => (
      count + (Array.isArray(item.data) ? item.data.length : 0)
    ), 0)
    if (points < 2 || !this.highstock) return
    if (this.highstock.clientWidth <= 0 || this.highstock.clientHeight <= 0) {
      clearTimeout(this.renderTimer)
      this.renderTimer = setTimeout(() => this.renderChart(), 100)
      return
    }
    try {
      return Highcharts.stockChart(update(this.props.config, {
        chart: {
          renderTo: {
            $set: this.highstock
          }
        }
      }))
    } catch (error) {
      console.error('[HighStock] chart initialization failed', error)
      return null
    }
  }

  render() {
    return (
      <div
        id={this.props.config.chart.renderTo}
        className={styles.stockChart}
        ref={ref => (this.highstock = ref)}
      />
    )
  }
}

roundedCorner(Highcharts)

StockChart.propTypes = {
  tag: PropTypes.string,
  data: PropTypes.array,
  config: PropTypes.object.isRequired
}

StockChart.defaultProps = {
  tag: '',
  data: [],
  config: {}
}

export default StockChart
