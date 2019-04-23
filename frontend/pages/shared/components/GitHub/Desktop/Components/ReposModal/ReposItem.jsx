
import React from 'react'
import { Label } from 'light-ui'
import Icon from 'COMPONENTS/Icon'

class ReposItem extends React.Component {
  render() {
    const { repository } = this.props
    return (
      <div className="repos_show">
        <div className="repos_info">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={repository.html_url}
            className="repos_info_name"
          >
            {repository.name}
          </a>&nbsp;&nbsp;
          {repository.stargazers_count > 0 ? (
            <span>
              <Icon icon="star" />
              &nbsp;{repository.stargazers_count}&nbsp;&nbsp;
            </span>
          ) : null}
          {repository.fork ? (
            <Label
              icon="code-fork"
              text="forked"
              color="darkLight"
              clickable={false}
            />
          ) : null}
          <br />
          <span>{repository.description}</span>
        </div>
      </div>
    )
  }
}

export default ReposItem
