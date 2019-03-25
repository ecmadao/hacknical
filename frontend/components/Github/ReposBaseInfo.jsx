import React from 'react'
import Icon from 'COMPONENTS/Icon'

const ReposBaseInfo = props => (
  <span>
    <Icon icon="star" />
    &nbsp;{props.stargazers}
    &nbsp;&nbsp;&nbsp;
    <Icon icon="code-fork" />
    &nbsp;{props.forks}
    &nbsp;&nbsp;&nbsp;
    <Icon icon="eye" />
    &nbsp;{props.watchers}
  </span>
)

export default ReposBaseInfo
