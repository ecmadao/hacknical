
import React from 'react'
import GitHubWrapperV2 from 'SHARED/components/GitHubWrapper/GitHubWrapperV2'
import GitHubContent from './GitHubContent'

const GitHubComponent = props => (
  <GitHubWrapperV2
    login={props.login}
    isShare={props.isShare}
    sections={props.sections}
  >
    <GitHubContent {...props} />
  </GitHubWrapperV2>
)

GitHubComponent.defaultProps = {
  login: window.login,
  isShare: false,
  sections: [],
  origin: window.location.origin
}

export default GitHubComponent
