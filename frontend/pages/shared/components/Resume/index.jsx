
import React from 'react'
import { Loading } from 'light-ui'
import { asyncComponent } from 'react-async-component'
import ResumeWrapper from 'SHARED/components/ResumeWrapper'
import styles from './shared/common.css'

const ResumeComponentLoader = (props) => {
  const { shareInfo, device } = props
  if (!shareInfo.template) return null

  const platform = `${device[0].toUpperCase()}${device.slice(1)}`

  const ResumeView = asyncComponent({
    resolve: () => System.import(`./${platform}/${shareInfo.template.toLowerCase()}`),
    LoadingComponent: () => <Loading loading />
  })

  return (
    <ResumeView {...props} />
  )
}

const ResumeComponent = props => {
  const containerClassName = props.device === 'mobile'
    ? styles.mobile_container
    : styles.desktop_container

  return (
    <ResumeWrapper {...props} className={containerClassName}>
      <ResumeComponentLoader {...props} />
    </ResumeWrapper>
  )
}

ResumeComponent.defaultProps = {
  resume: {},
  shareInfo: {},
  login: window.login,
  userId: window.userId,
  device: window.device,
  fromDownload: window.fromDownload === 'true' || window.fromDownload === true
}

export default ResumeComponent
