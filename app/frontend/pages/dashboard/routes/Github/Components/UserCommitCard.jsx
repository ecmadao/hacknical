import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Chart from 'chart.js';

import githubActions from '../redux/actions';


class UserCommitCard extends React.Component {
  constructor(props) {
    super(props);
    this.commitsReviewChart = null;
  }

  componentDidMount() {
    const {actions, commitDatas} = this.props;
    this.renderCharts();
    if (!commitDatas.length) {
      actions.fetchGithubCommits();
    }
  }

  componentDidUpdate(preProps) {
    this.renderCharts();
  }

  renderCharts() {
    const { commitDatas } = this.props;
    const { commits, dailyCommits } = commitDatas;
    if (dailyCommits.length) {
      !this.commitsReviewChart && this.renderLineChart(dailyCommits);
    }
  }

  renderLineChart(dailyCommits) {
    const commits = dailyCommits.slice(1);
    commits.push(dailyCommits[0]);
    const commitsChart = ReactDOM.findDOMNode(this.commitsChart);
    this.commitsReviewChart = new Chart(commitsChart, {
      type: 'line',
      data: {
        labels: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        datasets: [{
          data: dailyCommits,
          label: '平均每日提交记录',
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          spanGaps: false,
          // backgroundColor: BLUE_COLORS[3],
          // borderColor: BLUE_COLORS[0],
          // pointBackgroundColor: BLUE_COLORS[0],
          // pointBorderColor: "#fff",
          // pointHoverBackgroundColor: "#fff",
          // pointHoverBorderColor: BLUE_COLORS[0]
        }]
      }
    })
  }

  render() {
    return (
      <div className="info_card_container">
        <p><i aria-hidden="true" className="fa fa-git"></i>&nbsp;&nbsp;贡献信息</p>
        <div className="info_card card">
          <canvas id="commits_review" ref={ref => this.commitsChart = ref}></canvas>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { commitDatas } = state.github;
  return {
    commitDatas
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCommitCard);
