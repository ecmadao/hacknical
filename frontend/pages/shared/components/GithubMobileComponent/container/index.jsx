import React from 'react';
import GitHubWrapper from '../../GitHubWrapper';
import GitHubContent from './GitHubContent';

const GitHubMobileComponent = props => (
  <GitHubWrapper
    login={props.login}
    isShare={props.isShare}
  >
    <GitHubContent {...props} />
  </GitHubWrapper>
);

GitHubMobileComponent.defaultProps = {
  isShare: false,
  login: window.login,
  isAdmin: window.isAdmin === 'true',
};

export default GitHubMobileComponent;
