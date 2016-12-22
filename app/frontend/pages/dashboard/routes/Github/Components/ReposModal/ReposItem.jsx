import React, { PropTypes } from 'react';

class ReposItem extends React.Component {
  render() {
    const { repository } = this.props;
    return (
      <div className="repos_show">
        <div className="repos_info">
          <a
            target="_blank"
            href={repository['html_url']}
            className="repos_info_name">
            {repository.name}
          </a>{repository.fork ? (<span className="repos_info_forked">
            <i className="fa fa-code-fork" aria-hidden="true">
            </i>&nbsp;
            forked
          </span>) : ''}<br/>
          <span>{repository.description}</span>
        </div>
        <div className={`repos_star ${repository['stargazers_count'] > 0 ? 'active' : ''}`}>
          <i className={`fa ${repository['stargazers_count'] > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"></i>&nbsp;{repository['stargazers_count']}
        </div>
      </div>
    )
  }
}

export default ReposItem;
