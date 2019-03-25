
import React from 'react'
import { Loading } from 'light-ui'
import { asyncComponent } from 'react-async-component'

const ResumeViews = {
  v1: asyncComponent({
    resolve: () => System.import('./v1'),
    LoadingComponent: () => <Loading loading />
  }),
  v2: asyncComponent({
    resolve: () => System.import('./v2'),
    LoadingComponent: () => <Loading loading />
  }),
  v3: asyncComponent({
    resolve: () => System.import('./v3'),
    LoadingComponent: () => <Loading loading />
  })
}

const ResumeComponent = (props) => {
  const { shareInfo } = props
  const ResumeView = ResumeViews[shareInfo.template]
  if (!ResumeView) return null
  return <ResumeView {...props} />
}

ResumeComponent.defaultProps = {
  resume: {},
  shareInfo: {},
  login: window.login,
  fromDownload: window.fromDownload === 'true' || window.fromDownload === true
}

export default ResumeComponent
