import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CHOSED_REPOS from 'MOCK/chosed_repos';
import githubActions from '../redux/actions';
import {
  getMaxDate,
  sortByDate
} from '../helper/chosed_repos';

class UserReposCard extends React.Component {
  componentDidMount() {
    const {actions} = this.props;
    actions.choseRepos();
  }

  render() {
    return (
      <div className="info_card_container repos_card_container">
        <p><i aria-hidden="true" className="fa fa-cube"></i>&nbsp;&nbsp;仓库展示</p>
        <div className="info_card card">

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
