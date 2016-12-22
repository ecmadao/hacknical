import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import Loading from 'COMPONENTS/Loading';
import Operations from 'COMPONENTS/Operations'
import CHOSED_REPOS from 'MOCK/chosed_repos';
import githubActions from '../redux/actions';
import {
  getMaxDate,
  sortByDate
} from '../helper/chosed_repos';
import { hex2Rgba } from '../helper/color_helper';
import { getRelativeTime } from 'UTILS/date';

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
const MAX_OPACITY = 1;
const MIN_OPACITY = 0.3;

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
    const {actions, showedReposId} = this.props;
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
        stargazers_count,
        id,
        full_name,
        color
      } = repository;

      const left = offsetLeft(new Date(created_at));
      const right = offsetRight(new Date(pushed_at));
      repository.color = color || randomColor();
      const isActive = showedReposId === id;
      const wrapperClass = classNames('repos_timeline_wrapper', {
        'active': isActive
      });
      const handleClick = isActive ? actions.closeReposReadme : () => actions.showReposReadme(full_name, id);
      return (
        <div
          key={index}
          className={wrapperClass}
          style={{marginLeft: left, marginRight: right}}>
          <div
            style={{backgroundColor: repository.color}}
            className="repos_timeline"
            onClick={handleClick}>
          </div>
          <div className="repos_tipso">
            <div className="repos_tipso_container">
              <span className="tipso_title">{name}</span>&nbsp;&nbsp;{`<${language}>`}<br/>
              <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
              &nbsp;&nbsp;&nbsp;
              <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}<br/>
              <p>{created_at.split('T')[0]} ~ {pushed_at.split('T')[0]}</p>
            </div>
          </div>
        </div>
      )
    });
  }

  renderReposReadme(readme) {
    if (readme) {
      return (<div className="readme_container wysiwyg" dangerouslySetInnerHTML={{__html: readme}} />);
    }
    return (
      <div className="readme_container">
        <Loading />
      </div>
    )
  }

  renderReposIntros(repos) {
    const { showedReposId } = this.props;
    return repos.map((repository, index) => {
      const {name, description, color, id, readme} = repository;
      const rgb = hex2Rgba(color);
      const isTarget = id === showedReposId;
      const opacity = isTarget ? MIN_OPACITY : MAX_OPACITY;
      const infoClass = isTarget ? 'intro_info with_readme' : 'intro_info';
      return (
        <div className="repos_intro" key={index}>
          <div
            className="intro_line"
            style={{background: `linear-gradient(to bottom, ${rgb(MAX_OPACITY)}, ${rgb(opacity)})`}}></div>
          <div className="intro_info_wrapper">
            <div className={infoClass}>
              <span className="intro_title">{name}</span><br/>
              <span className="intro_desc">{description}</span>
            </div>
            {isTarget && this.renderReposReadme(readme)}
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
          <div className="repos_date">{getRelativeTime(this.minDate)}</div>
          <div className="repos_date">{getRelativeTime(this.maxDate)}</div>
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

  get operationItems() {
    const { actions } = this.props;
    return [
      {
        text: '更改仓库',
        icon: 'gears',
        onClick: () => actions.toggleModal(true)
      },
      {
        text: '不在简历中展示',
        onClick: () => {}
      }
    ]
  }

  render() {
    const {chosedRepos} = this.props;
    return (
      <div className="info_card_container repos_card_container">
        <p><i aria-hidden="true" className="fa fa-cubes"></i>&nbsp;&nbsp;仓库展示</p>
        <div className="info_card card">
          <Operations
            items={this.operationItems}
          />
          {chosedRepos.length ? this.renderChosedRepos() : this.renderEmptyCard()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { chosedRepos, showedReposId } = state.github;
  return { chosedRepos, showedReposId }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(githubActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserReposCard);
