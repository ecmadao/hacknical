import React from 'react';

const ReposBaseInfo = (props) => {
  return (
    <span>
      <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{props.stargazers}
      &nbsp;&nbsp;&nbsp;
      <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{props.forks}
      &nbsp;&nbsp;&nbsp;
      <i className="fa fa-eye" aria-hidden="true"></i>&nbsp;{props.watchers}
    </span>
  );
};

export default ReposBaseInfo;
