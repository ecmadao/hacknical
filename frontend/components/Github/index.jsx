import React, { PropTypes } from 'react';
import GithubSection from './GithubSection';


const Github = (options) => (props) => {
  const { isShare, callback } = options;
  return (
    <GithubSection
      {...props}
      isShare={isShare}
      callback={callback}
    />
  );
}

export default Github;
