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
    return Highcharts.stockChart(update(this.props.config, {
      chart: {
        renderTo: {
          $set: this.highstock
        }
      }
    }))
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
