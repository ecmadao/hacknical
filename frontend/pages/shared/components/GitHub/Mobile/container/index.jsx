import React from 'react'
import GitHubWrapperV1 from 'SHARED/components/GitHubWrapper/GitHubWrapperV1'
import GitHubMobileContent from './GitHubMobileContent'

const GitHubMobileComponent = props => (
  <GitHubWrapperV1
    login={props.login}
    isShare={props.isShare}
  >
    <GitHubMobileContent {...props} />
  </GitHubWrapperV1>
)

GitHubMobileComponent.defaultProps = {
  isShare: false,
  login: window.login,
  isAdmin: window.isAdmin === 'true',
}

export default GitHubMobileComponent
