import React, { PropTypes } from 'react';
import GithubSection from './GithubSection';


const Github = (options) => (props) => {
  const { isShare, callback } = options;
  return (
    <GithubSection
      isShare={isShare}
      callback={callback}
      {...props}
    />
  );
}

export default Github;
