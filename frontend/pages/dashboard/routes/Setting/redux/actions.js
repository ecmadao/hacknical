/* eslint global-require: "off" */
import Push from 'push.js'
import { createActions } from 'redux-actions'
import objectAssign from 'UTILS/object-assign'
import API from 'API'
import locales from 'LOCALES'
import refresher from 'UTILS/refresher'
import { REMOTE_ASSETS } from 'UTILS/constant'

const updateMsg = locales('github.message.update')

const {
  toggleSettingLoading,
  setUpdateStatus,
  initialResumeShareInfo,
  initialGithubShareInfo
} = createActions(
  'TOGGLE_SETTING_LOADING',
  'SET_UPDATE_STATUS',
  'INITIAL_RESUME_SHARE_INFO',
  'INITIAL_GITHUB_SHARE_INFO'
)

// github data update
const fetchGithubUpdateStatus = () => (dispatch) => {
  API.github.getUpdateStatus().then((result) => {
    dispatch(setUpdateStatus(result))
  })
}

const refreshGithubDatas = () => (dispatch) => {
  dispatch(toggleSettingLoading(true))
  API.github.update().then(() => {
    refresher.fire(5000, (result) => {
      dispatch(setUpdateStatus(result))
      Push.create(updateMsg.header, {
        body: updateMsg.body,
        icon: REMOTE_ASSETS.NOTIFY_ICON,
        timeout: 3000
      })
    })
  })
}

// github share
const fetchGithubShareInfo = () => (dispatch) => {
  API.github.getShareRecords().then((result) => {
    dispatch(initialGithubShareInfo(result))
  })
}

const postGithubShareStatus = () => (dispatch, getState) => {
  const { openShare } = getState().setting.githubInfo
  API.user.patchUserInfo({ githubShare: !openShare }).then(() => {
    dispatch(initialGithubShareInfo({
      openShare: !openShare
    }))
  })
}

// resume
const fetchResumeShareInfo = () => (dispatch) => {
  API.resume.getResumeInfo().then((result) => {
    dispatch(initialResumeShareInfo(result))
  })
}

const patchResumeInfo = key => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const { loading } = resumeInfo
  const value = resumeInfo[key]

  if (loading) return

  API.resume.patchResumeInfo({ [key]: !value }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      [key]: !value
    })))
  })
}

const postResumeReminderChange = (key, value) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const preVal = resumeInfo.reminder[key]
  if (preVal === value) return

  const reminder = objectAssign({}, resumeInfo.reminder, { [key]: value })

  API.resume.patchResumeInfo({ reminder }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      reminder
    })))
  })
}

const patchResumeGitHubSection = (sectionIndex, checked) => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const githubSections = [
    ...resumeInfo.githubSections.slice(0, sectionIndex),
    objectAssign({}, resumeInfo.githubSections[sectionIndex], { enabled: checked }),
    ...resumeInfo.githubSections.slice(sectionIndex + 1),
  ]

  API.resume.patchResumeInfo({ githubSections }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      githubSections
    })))
  })
}

const reorderResumeGitHubSections = order => (dispatch, getState) => {
  const { resumeInfo } = getState().setting
  const { githubSections } = resumeInfo

  const fromIndex = order.source.index
  const toIndex = order.destination.index
  if (toIndex === fromIndex) return

  const [githubSection] = githubSections.splice(fromIndex, 1)
  githubSections.splice(toIndex, 0, githubSection)

  API.resume.patchResumeInfo({ githubSections }).then(() => {
    dispatch(initialResumeShareInfo(objectAssign({}, resumeInfo, {
      githubSections
    })))
  })
}

export default {
  // github
  toggleSettingLoading,
  setUpdateStatus,
  fetchGithubUpdateStatus,
  refreshGithubDatas,
  // github share
  fetchGithubShareInfo,
  initialGithubShareInfo,
  postGithubShareStatus,
  // resume
  initialResumeShareInfo,
  fetchResumeShareInfo,
  postResumeReminderChange,
  patchResumeGitHubSection,
  patchResumeInfo,
  reorderResumeGitHubSections
}
