
import React, { cloneElement } from 'react'
import { polyfill } from 'es6-promise'
import objectAssign from 'UTILS/object-assign'
import API from 'API'
import locales from 'LOCALES'
import github from 'UTILS/github'
import { removeDOM } from 'UTILS/helper'
import formatHotmap from 'UTILS/hotmap'
import message from 'UTILS/message'
import refresher from 'UTILS/refresher'
import {
  USER,
  GITHUB_SECTIONS,
  DEFAULT_GITHUB_SECTIONS,
  getGitHubSectionIntroBySection,
  getGitHubSectionDefaultDataById
} from 'UTILS/constant/github'

polyfill()

const githubMsg = locales('github.message')
const sortByLanguageStar = github.sortByX({ key: 'stargazers_count' })

const fetchHotmap = async (login) => {
  const result = await API.github.getUserHotmap(login)
  const hotmap = formatHotmap(result)
  return hotmap
}

const fetchRepositories = async (login = '') => {
  const [
    repositories,
    commitRes,
  ] = await Promise.all([
    API.github.getRepositories(login),
    API.github.getCommits(login)
  ])

  const forkedRepositories = []
  const ownedRepositories = []

  for (const repository of repositories) {
    if (repository.fork) {
      forkedRepositories.push(repository)
    } else {
      ownedRepositories.push(repository)
    }
  }

  return {
    ownedRepositories,
    forkedRepositories,
    commitDatas: commitRes ? [...commitRes.commits] : [],
  }
}

const fetchCourse = async (login = '') => {
  const [
    repositories,
    commitRes,
  ] = await Promise.all([
    API.github.getRepositories(login),
    API.github.getCommits(login)
  ])

  return {
    repositories: repositories.filter(repo => !repo.fork),
    commitDatas: commitRes ? [...commitRes.commits] : [],
  }
}

const fetchGithubRepositories = async (login = '') => {
  const [
    repositories,
    languages
  ] = await Promise.all([
    API.github.getRepositories(login),
    API.github.getLanguages(login)
  ])

  return {
    languages,
    languageUsed: github.getLanguageUsed(repositories),
    languageSkills: github.getLanguageSkill(repositories),
    repositories: [...repositories.sort(sortByLanguageStar)],
    languageDistributions: github.getLanguageDistribution(repositories)
  }
}

const fetchGithubCommits = async (login = '') => {
  const result = await API.github.getCommits(login)

  const {
    commits = [],
    formatCommits = {}
  } = (result || {})
  return {
    commitDatas: [...commits],
    commitInfos: formatCommits
  }
}

const getDataFetchMethodBySection = (sectionId) => {
  switch (sectionId) {
    case GITHUB_SECTIONS.HOTMAP:
      return fetchHotmap
    case GITHUB_SECTIONS.INFO:
      return API.github.getUser
    case GITHUB_SECTIONS.REPOS:
      return fetchRepositories
    case GITHUB_SECTIONS.TIMELINE:
      return fetchCourse
    case GITHUB_SECTIONS.LANGUAGES:
      return fetchGithubRepositories
    case GITHUB_SECTIONS.ORGS:
    case GITHUB_SECTIONS.CONTRIBUTIONS:
      return login => login
    case GITHUB_SECTIONS.COMMITS:
      return fetchGithubCommits
    default:
      throw new Error(`unknown section id: ${sectionId}`)
  }
}

class GitHubWrapperV2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      user: objectAssign({}, USER),
      chosedRepos: [],
      openModal: false,
      scientific: {
        statistic: null,
        predictions: []
      },
      githubSections: [],
    }

    this.onRefresh = this.onRefresh.bind(this)
    this.setRefreshStatus = this.setRefreshStatus.bind(this)
    this.changeShareStatus = this.changeShareStatus.bind(this)
    this.toggleGitHubSection = this.toggleGitHubSection.bind(this)
  }

  componentDidMount() {
    const { login } = this.props
    this.fetchGithubUser(login)
    this.fetchGitHubSections(login)
    this.fetchUpdateStatus()
    removeDOM('#loading', { async: true })
  }

  componentDidUpdate(preProps) {
    const { sections } = this.props

    const identify1 = (sections || []).map(section => section.id).join('.')
    const identify2 = (preProps.sections || []).map(section => section.id).join('.')
    if (identify1 !== identify2) {
      const { githubSections } = this.state
      const newSections = sections.reduce((list, section) => {
        const item = githubSections.find(sec => sec.id === section.id)
        if (!item) return list
        list.push(item)
        return list
      }, [])

      this.setState({
        githubSections: newSections
      })
    }
  }

  async fetchGitHubSections(login = '') {
    const { isShare } = this.props
    const sectionData = await API.user.getGitHubSections(login)

    const githubSections = (sectionData || [...DEFAULT_GITHUB_SECTIONS]).reduce((sections, section) => {
      if (!section.enabled && isShare) return sections
      sections.push(
        objectAssign({}, section, {
          loading: true,
          data: getGitHubSectionDefaultDataById(section.id)
        }, getGitHubSectionIntroBySection(section))
      )
      return sections
    }, [])

    this.setState({
      githubSections: [...githubSections]
    })

    const res = []
    await Promise.all(githubSections.map(async (section, index) => {
      const fetchMethod = getDataFetchMethodBySection(section.id)
      const data = await fetchMethod(login)
      res[index] = objectAssign({}, section, { data, loading: false })
    }))

    this.setState({ githubSections: res })
  }

  async fetchGithubStatistic(login = '') {
    const statistic = await API.scientific.getUserStatistic(login)
    const { scientific } = this.state
    this.setState({
      statisticLoaded: true,
      scientific: objectAssign(scientific, { statistic: statistic || null })
    })
  }

  async fetchGithubScientific(login = '') {
    const predictions = await API.scientific.getUserPredictions(login)
    const { scientific } = this.state
    this.setState({
      scientific: objectAssign(scientific, { predictions: predictions || [] })
    })
  }

  async fetchGithubUser(login = '') {
    const user = await API.github.getUser(login)
    this.setState({ user, loading: false })
  }

  async fetchUpdateStatus() {
    const { isAdmin } = this.props
    if (!isAdmin) return
    const result = await API.github.getUpdateStatus()
    this.setRefreshStatus(result)
  }

  toggleGitHubSection(index, section) {
    const { isShare, isAdmin } = this.props
    if (isShare || !isAdmin) return

    const { githubSections } = this.state
    const sections = [
      ...githubSections.slice(0, index),
      objectAssign({}, githubSections[index], section),
      ...githubSections.slice(index + 1)
    ]

    API.resume.patchResumeInfo({
      githubSections: sections.map(section => ({
        id: section.id,
        enabled: section.enabled
      }))
    }).then(() => {
      this.setState({
        githubSections: sections
      })
    })
  }

  setRefreshStatus(data) {
    const { refreshing = true, refreshEnable = false } = (data || {})
    this.setState({
      refreshing,
      refreshEnable
    })
    if (refreshing && !this.heartBeat) {
      this.createHeartBeat()
    }
  }

  createHeartBeat() {
    if (this.heartBeat) return
    this.heartBeat = true
    refresher.fire(4000, (result) => {
      this.setRefreshStatus(result)
      setTimeout(() => {
        window.location.reload(false)
      }, 3000)
    })
  }

  onRefresh() {
    const { refreshEnable } = this.state
    if (!refreshEnable) {
      message.error(githubMsg.update.error)
      return
    }
    this.setRefreshStatus({
      refreshing: true,
      refreshEnable: false
    })
    API.github.update().then(() => this.createHeartBeat())
  }

  onPredictionUpdate(index, liked) {
    const { scientific, user } = this.state
    const { login } = user
    const prediction = scientific.predictions[index]
    const likedCount = prediction.likedCount + liked
    const predictions = [
      ...scientific.predictions.slice(0, index),
      objectAssign({}, prediction, {
        liked,
        likedCount: likedCount >= 0 ? likedCount : 0
      }),
      ...scientific.predictions.slice(index + 1)
    ]
    this.setState({
      scientific: objectAssign({}, scientific, {
        predictions
      })
    })
    API.scientific.putPredictionFeedback(login, prediction.full_name, liked)
  }

  onPredictionDelete(index) {
    const { scientific, user } = this.state
    const { login } = user
    const prediction = scientific.predictions[index]
    const predictions = [
      ...scientific.predictions.slice(0, index),
      ...scientific.predictions.slice(index + 1)
    ]
    this.setState({
      scientific: objectAssign({}, scientific, {
        predictions
      })
    })
    API.scientific.removePrediction(login, prediction.full_name)
  }

  onPredictionFeedback(index, liked) {
    if (liked === -2) {
      this.onPredictionDelete(index, liked)
    } else {
      this.onPredictionUpdate(index, liked)
    }
  }

  async changeShareStatus() {
    const { user } = this.state
    const { openShare } = user
    await API.user.patchUserInfo({ githubShare: !openShare })
    this.toggleShare(!openShare)
  }

  toggleShare(openShare) {
    const { user } = this.state
    this.setState({
      user: objectAssign({}, user, {
        openShare
      })
    })
  }

  render() {
    const { children, login, isShare } = this.props

    const component = cloneElement(children, {
      ...this.state,
      login,
      isShare,
      onRefresh: this.onRefresh,
      toggleGitHubSection: this.toggleGitHubSection,
    })
    return component
  }
}

GitHubWrapperV2.defaultProps = {
  isShare: false,
  login: window.login,
  sections: [],
  isAdmin: window.isAdmin === 'true'
}

export default GitHubWrapperV2
