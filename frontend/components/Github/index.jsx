import React, { PropTypes } from 'react';
import GitHubSection from './GithubSection';


const Github = (options) => (props) => {
  const { isShare, callback } = options;
  return (
    <GitHubSection
      {...props}
      isShare={isShare}
      callback={callback}
    />
  );
}

export default Github;
