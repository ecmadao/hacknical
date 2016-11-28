import React from 'react';
import CHOSED_REPOS from 'MOCK/chosed_repos';

class UserReposCard extends React.Component {
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

export default UserReposCard;
