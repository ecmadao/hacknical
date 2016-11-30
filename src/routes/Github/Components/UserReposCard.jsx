import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CHOSED_REPOS from 'MOCK/chosed_repos';
import githubActions from '../redux/actions';
import {
  getMaxDate,
  sortByDate
} from '../helper/chosed_repos';

const getOffsetLeft = (start, end) => (left) => {
  const length = end - start;
  return `${(left - start) * 100 / length}%`;
};

const getOffsetRight = (start, end) => (right) => {
  const length = end - start;
  return `${(end - right) * 100 / length}%`;
};

const RANDOM_COLORS = [
  '#4A90E2',
  '#50E3C2',
  '#9B9B9B',
  '#00BCD4',
  '#F44336',
  '#FDD835',
  '#FF9800',
  '#78909C',
  '#673AB7',
  '#E91E63'
];

const randomColor = () => {
  const index = Math.floor(Math.random() * RANDOM_COLORS.length);
  return RANDOM_COLORS[index];
};

class UserReposCard extends React.Component {
  constructor(props) {
    super(props);
    this.minDate = null;
    this.maxDate = null;
  }

  componentDidMount() {
    const {actions} = this.props;
    actions.choseRepos();
  }

  renderEmptyCard() {
    return (
      <div></div>
    )
  }

  renderTimeLine(repos) {
    const minDate = new Date(this.minDate);
    const maxDate = new Date(this.maxDate);
    const offsetLeft = getOffsetLeft(minDate, maxDate);
    const offsetRight = getOffsetRight(minDate, maxDate);
    return repos.map((repository, index) => {
      const {
        created_at,
        pushed_at,
        name,
        language,
        forks_count,
        stargazers_count
      } = repository;

      const left = offsetLeft(new Date(created_at));
      const right = offsetRight(new Date(pushed_at));
      const color = randomColor();
      repository.color = color;
      return (
        <div
          key={index}
          className="repos_timeline_wrapper"
          style={{marginLeft: left, marginRight: right}}>
          <div
            style={{backgroundColor: color}}
            className="repos_timeline">
          </div>
          <div className="repos_tipso">
            <div className="tipso_container">
              <span className="tipso_title">{name}</span>&nbsp;{`<${language}>`}<br/>
              <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
              &nbsp;&nbsp;
              <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}<br/>
              <p>{created_at.split('T')[0]} ~ {pushed_at.split('T')[0]}</p>
            </div>
          </div>
        </div>
      )
    });
  }

  renderReposIntros(repos) {
    return repos.map((repository, index) => {
      const {name, description, color} = repository;
      return (
        <div className="repos_intro" key={index}>
          <div
            className="intro_line"
            style={{backgroundColor: color}}></div>
          <div className="intro_info">
            <span className="intro_title">{name}</span><br/>
            <span className="intro_desc">{description}</span>
          </div>
        </div>
      );
    });
  }

  renderChosedRepos() {
    const { chosedRepos } = this.props;
    const sortedRepos = sortByDate(chosedRepos);
    this.minDate = sortedRepos[0]['created_at'].split('T')[0];
    this.maxDate = getMaxDate(sortedRepos);
    return (
      <div className="repos_timeline_container">
        <div className="repos_dates">
          <div className="repos_date">{this.minDate}</div>
          <div className="repos_date">{this.maxDate}</div>
        </div>
        <div className="repos_timelines">
          {this.renderTimeLine(sortedRepos)}
        </div>
        <div className="repos_intros">
          {this.renderReposIntros(sortedRepos)}
        </div>
      </div>
    )
  }

  render() {
    const {chosedRepos} = this.props;
    return (
      <div className="info_card_container repos_card_container">
        <p><i aria-hidden="true" className="fa fa-cube"></i>&nbsp;&nbsp;仓库展示</p>
        <div className="info_card card">
          {chosedRepos.length ? this.renderChosedRepos() : this.renderEmptyCard()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { chosedRepos } = state.github;
  return { chosedRepos }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserReposCard);
