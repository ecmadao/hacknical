import React, { PropTypes } from 'react';
import Highcharts from 'highcharts/highstock';
import update from 'react/lib/update';
import roundedCorner from './roundedCorner';
import styles from './styles.css';

class StockChart extends React.PureComponent {
  constructor() {
    super();
    this.highstock = null;
  }

  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    this.renderChart();
  }

  renderChart() {
    return Highcharts.stockChart(update(this.props.config, {
      chart: {
        renderTo: {
          $set: this.highstock
        }
      }
    }));
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

roundedCorner(Highcharts);

StockChart.propTypes = {
  config: PropTypes.object.isRequired,
};

export default StockChart;
