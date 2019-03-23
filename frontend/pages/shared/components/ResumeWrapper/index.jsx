
import React from 'react'
import objectAssign from 'UTILS/object-assign'
import API from 'API'
import {
  INFO,
  OTHERS
} from 'UTILS/constant/resume'
import locales from 'LOCALES'
import ResumeFormatter from './ResumeFormatter'
import { removeDOM } from 'UTILS/helper'

const resumeTexts = locales('resume')

class ResumeWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      updateAt: '',
      initialized: true,
      info: objectAssign({}, INFO),
      educations: [],
      workExperiences: [],
      personalProjects: [],
      others: objectAssign({}, OTHERS),
      shareInfo: {
        github: {},
        useGithub: true,
        githubUrl: null,
        template: 'v0'
      },
      customModules: []
    }
  }

  componentDidMount() {
    this.fetchResumeData()
  }

  componentDidUpdate(_, preState) {
    const { loading } = this.state
    if (!loading && preState.loading) {
      removeDOM('#loading', { async: true, timeout: 500 })
      setTimeout(() => window.done = true, 2000)
    }
  }

  async fetchResumeData() {
    const { userId } = this.props
    const resumeInfo = await API.resume.getResumeInfo({ userId })
    const { resumeHash } = resumeInfo

    this.initialShareInfo(resumeInfo)
    this.fetchResume(resumeHash)
  }

  fetchResume(hash) {
    if (!hash) {
      this.initialResume({ initialized: false })
    } else {
      API.resume.getPubResume(hash).then(result =>
        result && this.initialResume(result)
      )
    }
  }

  initialShareInfo(data) {
    const { shareInfo } = this.state
    this.setState({
      shareInfo: objectAssign({}, shareInfo, data)
    })
  }

  initialResume(resume = {}) {
    const {
      info = INFO,
      others = OTHERS,
      educations = [],
      initialized = true,
      customModules = [],
      workExperiences = [],
      personalProjects = [],
      updateAt = new Date()
    } = resume

    const state = this.state
    this.setState({
      updateAt,
      initialized,
      loading: false,
      customModules,
      others: objectAssign({}, state.others, others),
      info: objectAssign({}, state.info, info),
      educations: [...educations],
      workExperiences: [...workExperiences],
      personalProjects: [...personalProjects]
    })
  }

  render() {
    const {
      login,
      children,
      className
    } = this.props
    const resumeProps = objectAssign({}, this.state)
    const shareInfo = objectAssign({}, resumeProps.shareInfo)
    delete resumeProps.shareInfo
    delete resumeProps.loading

    return (
      <div className={className}>
        <ResumeFormatter
          login={login}
          resume={resumeProps}
          shareInfo={shareInfo}
          loading={this.state.loading}
          updateText={resumeTexts.updateAt}
        >
          {children}
        </ResumeFormatter>
      </div>
    );
  }
}

export default ResumeWrapper
