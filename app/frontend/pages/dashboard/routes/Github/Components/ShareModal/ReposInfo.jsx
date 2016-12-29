import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import github from 'UTILS/github';
import chart from 'UTILS/chart';
import ChartInfo from '../shared/ChartInfo';

class ReposInfo extends React.Component {
  constructor(props) {
    super(props);
    this.reposChart = null;
  }

  componentDidMount() {
    this.renderCharts();
  }

  componentDidUpdate() {
    this.renderCharts();
  }

  renderCharts() {
    const { repos } = this.props;
    if (repos.length) {
      !this.reposChart && this.renderReposChart(repos.slice(0, 10));
    }
  }

  renderReposChart(repos) {
    const { commits } = this.props;
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    this.reposChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: github.getReposNames(repos),
        datasets: [
          chart.getStarDatasets(repos),
          chart.getForkDatasets(repos),
          chart.getCommitDatasets(repos, commits)
        ]
      },
      options: {
        title: {
          display: true,
          text: '仓库 star/fork/commit 数一览（取前十）'
        },
        scales: {
          xAxes: [{
            display: false,
            gridLines: {
              display:false
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
          }]
        },
      }
    });
  }

  render() {
    const { repos, commits } = this.props;
    const [totalStar, totalFork] = github.getTotalCount(repos);
    // const maxStaredRepos = repos[0];
    // const maxTimeRepos = github.longestContributeRepos(repos);
    // const startTime = maxTimeRepos['created_at'].split('T')[0];
    // const pushTime = maxTimeRepos['pushed_at'].split('T')[0];
    const yearlyRepos = github.getYearlyRepos(repos);

    return (
      <div className="share_info_section">
        <div className="share_info_chart">
          <canvas ref={ref => this.reposReview = ref}></canvas>
        </div>
        <div className="share_repos_info">
          <ChartInfo
            icon="star-o"
            mainText={totalStar}
            subText="收获 star 数"
          />
          <ChartInfo
            icon="code-fork"
            mainText={totalFork}
            subText="收获 fork 数"
          />
          <ChartInfo
            icon="cubes"
            mainText={yearlyRepos.length}
            subText="创建的仓库数"
          />
          <ChartInfo
            icon="code"
            mainText={commits[0].totalCommits}
            subText="单个仓库最多提交数"
          />
        </div>
      </div>
    )
  }
}

export default ReposInfo;
