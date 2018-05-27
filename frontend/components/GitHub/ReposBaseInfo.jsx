import React from 'react';

const ReposBaseInfo = props => (
  <span>
    <i className="fa fa-star" aria-hidden="true" />
    &nbsp;{props.stargazers}
    &nbsp;&nbsp;&nbsp;
    <i className="fa fa-code-fork" aria-hidden="true" />
    &nbsp;{props.forks}
    &nbsp;&nbsp;&nbsp;
    <i className="fa fa-eye" aria-hidden="true" />
    &nbsp;{props.watchers}
  </span>
);

export default ReposBaseInfo;
