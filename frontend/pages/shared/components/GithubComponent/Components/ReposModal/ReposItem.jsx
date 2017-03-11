import React, { PropTypes } from 'react';
import { Label } from 'light-ui';

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
          </a>&nbsp;&nbsp;
          {repository['stargazers_count'] > 0 ? (
            <span>
              <i
                className="fa fa-star"
                aria-hidden="true"></i>
              &nbsp;{repository['stargazers_count']}&nbsp;&nbsp;
            </span>
          ) : ''}
          {repository.fork ? (
            <Label
              icon="code-fork"
              text="forked"
              color="gray"
              clickable={false}
            />
          ) : ''}
          <br/>
          <span>{repository.description}</span>
        </div>
      </div>
    )
  }
}

export default ReposItem;
