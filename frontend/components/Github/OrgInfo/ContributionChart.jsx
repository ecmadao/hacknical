import React, { PropTypes } from 'react';
import Chart from 'chart.js';
import ReactDOM from 'react-dom';
import objectAssign from 'object-assign';

import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';
import { GREEN_COLORS } from 'UTILS/colors';
import { DAYS, LINECHART_CONFIG } from 'UTILS/const_value';

class ContributionChart extends React.Component {
  constructor(props) {
    super(props);
    this.contributionReviewChart = null;
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate() {
    this.renderCharts();
  }

  renderCharts() {
    const { contribution } = this.props;
    if (contribution) {
      if (!this.contributionReviewChart) {
        return this.renderContributionChart(contribution.weeks);
      } else {
        return this.updateCharts(contribution.weeks);
      }
    }
  }

  updateCharts(contributions) {
    const data = [], labels = [];
    contributions.forEach((contribution) => {
      data.push(contribution.data);
      labels.push(dateHelper.date.bySeconds(contribution.week));
    });
    this.contributionReviewChart.data.labels = labels;
    this.contributionReviewChart.data.datasets[0].data = data;
    this.contributionReviewChart.update();
  }

  renderContributionChart(contributions) {
    const data = [], labels = [];
    contributions.forEach((contribution) => {
      data.push(contribution.data);
      labels.push(dateHelper.date.bySeconds(contribution.week));
    });
    const contributionChart = ReactDOM.findDOMNode(this.contributionChart);
    this.contributionReviewChart = new Chart(contributionChart, {
      type: 'line',
      data: {
        labels,
        datasets: [objectAssign({}, LINECHART_CONFIG, {
          data,
          label: '',
          pointHoverRadius: 2,
          pointHoverBorderWidth: 2,
          pointHitRadius: 2,
          pointBorderWidth: 0,
          pointRadius: 0,
          borderColor: GREEN_COLORS[4],
        })]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: false,
          text: ''
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display:false
            },
            ticks: {
              beginAtZero:true
            }
          }],
          yAxes: [{
            display: false,
            gridLines: {
              display:false
            },
            ticks: {
              beginAtZero:true
            }
          }],
        }
      }
    });
  }

  renderContributionDates() {
    const { contribution, repository } = this.props;
    if (!contribution.weeks.length) { return '' }
    // commit dates
    const { weeks } = contribution;
    const startDate = dateHelper.date.bySeconds(weeks[0].week);
    const endDate = dateHelper.date.bySeconds(weeks.slice(-1)[0].week);
    // repos info
    const {
      name,
      description,
      stargazers_count,
      contributors,
      forks_count,
      language,
      html_url,
      fork,
      watchers_count
    } = repository;

    return (
      <div className={styles["repos_details"]}>
        <div className={styles["contribution_dates"]}>
          <div className={styles["contribution_date"]}>{startDate}</div>
          <div className={styles["contribution_date"]}>{endDate}</div>
        </div>
        <div className={styles["org_repos_infos"]}>
          <div className={styles["org_repos_info"]}>
            <a className={styles["repos_title"]} href={html_url} target="_blank">
              {name}
            </a>
            &nbsp;&nbsp;
            {fork ? (
              <span className={styles["repos_label"]}>fork</span>
            ) : ''}
          </div>
          <div className={styles["org_repos_info"]}>
            <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-eye" aria-hidden="true"></i>&nbsp;{watchers_count}
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-code" aria-hidden="true"></i>&nbsp;{language || 'NULL'}
            &nbsp;&nbsp;&nbsp;
          </div>
          {description ? (
            <div className={styles["org_repos_desc_info"]}>
              <blockquote>{description}</blockquote>
            </div>
          ) : ''}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles["contributions_chart_container"]}>
        <div className={styles["chart_container"]}>
          <canvas ref={ref => this.contributionChart = ref}></canvas>
        </div>
        {this.renderContributionDates()}
      </div>
    )
  }
}

ContributionChart.propTypes = {
  contribution: PropTypes.object,
  repository: PropTypes.object,
};

ContributionChart.defaultProps = {
  contribution: {
    weeks: []
  },
  repository: {}
};

export default ContributionChart;
