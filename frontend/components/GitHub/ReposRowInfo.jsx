import React from 'react';
import cx from 'classnames';
import { Label } from 'light-ui';
import githubStyles from './styles/github.css';

const ReposRowInfo = (props) => {
  const {
    repository,
    className = '',
  } = props;
  const stargazersCount = repository.stargazers_count;
  const starClass = cx(
    githubStyles.repos_star,
    stargazersCount > 0 && githubStyles.active
  );
  return (
    <div
      className={cx(
        githubStyles.repos_show,
        className
      )}
    >
      <div className={githubStyles.repos_info}>
        <div className={githubStyles.reposTitleContainer}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={repository.html_url}
            className={githubStyles.repos_info_name}
          >
            {repository.name}
          </a>
          &nbsp;
          {repository.fork ? (
            <Label
              min
              icon="code-fork"
              text="forked"
              color="darkLight"
              clickable={false}
            />
          ) : ''}
        </div>
        <span className={githubStyles.repos_short_desc}>
          {repository.description}
        </span>
      </div>
      <div className={starClass}>
        <i
          className={`fa ${stargazersCount > 0 ? 'fa-star' : 'fa-star-o'}`} aria-hidden="true"
        />
        &nbsp;
        {stargazersCount}
      </div>
    </div>
  );
};

export default ReposRowInfo;
