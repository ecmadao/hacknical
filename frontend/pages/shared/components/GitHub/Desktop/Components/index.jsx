
import React from 'react'
import GitHubWrapper from 'SHARED/components/GitHubWrapper'
import GitHubContent from './GitHubContent'

const GitHubComponent = props => (
  <GitHubWrapper
    login={props.login}
    isShare={props.isShare}
  >
    <GitHubContent {...props} />
  </GitHubWrapper>
)

GitHubComponent.defaultProps = {
  login: window.login,
  isShare: false,
  origin: window.location.origin
}

export default GitHubComponent
