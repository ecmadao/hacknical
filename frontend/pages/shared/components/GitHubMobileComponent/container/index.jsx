import React from 'react';
import GitHubWrapper from '../../GitHubWrapper';
import GitHubMobileContent from './GitHubMobileContent';

const GitHubMobileComponent = props => (
  <GitHubWrapper
    login={props.login}
    isShare={props.isShare}
  >
    <GitHubMobileContent {...props} />
  </GitHubWrapper>
);

GitHubMobileComponent.defaultProps = {
  isShare: false,
  login: window.login,
  isAdmin: window.isAdmin === 'true',
};

export default GitHubMobileComponent;
