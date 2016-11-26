import React from 'react';
import ReactDOM from 'react-dom';
import Chart from 'chart.js';
import {
  getFlatReposInfos,
  getReposNames,
  getReposForks,
  getReposStars
} from '../helper/repos';

const REPOS_BASE_URL = 'https://github.com';

const getForkDatasets = (repos) => {
  return {
    label: 'forks',
    data: getReposForks(repos),
    backgroundColor: 'rgba(74, 144, 226, 0.4)',
    borderColor: 'rgba(74, 144, 226, 0.7)',
    borderWidth: 1
  }
};

const chartClickCallback = (username) => {
  return (ctx, data) => {
    window.location.target = "_blank";
    const reposName = data[0]['_model'].label;
    window.open(`${REPOS_BASE_URL}/${username}/${reposName}`);
  }
};

const getStarDatasets = (repos) => {
  return {
    label: 'stars',
    data: getReposStars(repos),
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
    borderColor: 'rgba(74, 144, 226, 1)',
    borderWidth: 1
  }
};

class UserChartCard extends React.Component {
  componentDidMount() {
    const {username, repos} = this.props;
    const flatRepos = getFlatReposInfos(repos);
    const reposReview = ReactDOM.findDOMNode(this.reposReview);
    const reposReviewChart = new Chart(reposReview, {
      type: 'bar',
      data: {
        labels: getReposNames(flatRepos),
        datasets: [getStarDatasets(flatRepos), getForkDatasets(flatRepos)]
      },
      options: {
        onClick: chartClickCallback(username),
        title: {
          display: true,
          text: '仓库 star/fork 数一览（取前十）'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

  render() {
    return (
      <div className="info_card_container repos_card_container">
        <p>仓库概览</p>
        <div className="info_card card">
          <div className="repos_review">
            <canvas id="repos_review" ref={ref => this.reposReview = ref}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

export default UserChartCard;
