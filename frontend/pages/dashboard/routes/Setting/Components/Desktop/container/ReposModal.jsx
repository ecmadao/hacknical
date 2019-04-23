/* eslint no-param-reassign: "off" */

import React from 'react'
import PropTypes from 'prop-types'
import { PortalModal, Button, Loading, Input } from 'light-ui'
import API from 'API'
import ReposCard from './ReposCard'
import styles from '../styles/modal.css'
import locales from 'LOCALES'
import Icon from 'COMPONENTS/Icon'

const settingTexts = locales('dashboard').setting.github

// TODO:
// Pinned ReposModal was disabled in 2018/02/06 commit:
// Disable pinned repositories filter & fix shared page view data count issue
class ReposModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rawPinned: [],
      pinned: [],
      repositories: [],
      query: '',
      checkAll: false,
      loading: true
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onCheckAll = this.onCheckAll.bind(this)
    this.onQueryChange = this.onQueryChange.bind(this)
    this.addPinnedRepository = this.addPinnedRepository.bind(this)
    this.removePinnedRepository = this.removePinnedRepository.bind(this)
  }

  componentDidMount() {
    this.fetchPinnedRepositories()
  }

  componentDidUpdate(preProps) {
    const { openModal } = this.props
    const { repositories } = this.state
    if (openModal && !preProps.openModal) {
      !repositories.length && this.fetchRepositories()
    }
  }

  onClose() {
    const { rawPinned } = this.state
    const { onClose } = this.props
    this.changeState({
      pinned: [...rawPinned]
    })
    onClose && onClose()
  }

  onSubmit() {
    const { pinned } = this.state
    const { onClose } = this.props
    API.user.patchUserInfo({ pinnedRepos: pinned })
    this.changeState({
      rawPinned: [...pinned]
    })
    onClose && onClose()
  }

  onCheckAll() {
    const { checkAll } = this.state
    const newPinned = !checkAll ? this.defaultPinned() : []
    this.changeState({
      checkAll: !checkAll,
      pinned: [...newPinned]
    })
  }

  defaultPinned(repositories = null) {
    repositories = repositories || this.state.repositories
    return repositories.map(repository => repository.name)
  }

  async fetchRepositories() {
    const { pinned } = this.state
    const result = await API.github.getAllRepositories()
    const pinnedRepos = pinned.length ? pinned : this.defaultPinned(result)
    this.changeState({
      repositories: [...result],
      pinned: [...pinnedRepos],
      rawPinned: [...pinnedRepos],
      loading: false,
      checkAll: !pinned.length || pinned.length === result.length
    })
  }

  async fetchPinnedRepositories() {
    const user = await API.user.getUserInfo()
    const pinned = user.pinnedRepos || this.defaultPinned()
    this.changeState({
      pinned: [...pinned],
      rawPinned: [...pinned]
    })
  }

  onQueryChange(query) {
    this.changeState({ query })
  }

  changeState(state) {
    this.setState(state)
  }

  addPinnedRepository(repositoryId) {
    const { pinned } = this.state
    this.changeState({
      pinned: [...pinned, repositoryId]
    })
  }

  removePinnedRepository(repositoryId) {
    const { pinned } = this.state
    this.changeState({
      pinned: pinned.filter(item => item !== repositoryId)
    })
  }

  renderRepos() {
    const { repositories, pinned, query } = this.state
    const pattern = new RegExp(query)
    const filterRepos = query
      ? repositories.filter(repository => pattern.test(repository.name))
      : repositories
    return filterRepos.map((repository, index) => (
      <ReposCard
        key={index}
        repository={repository}
        onRemove={this.removePinnedRepository}
        onPinned={this.addPinnedRepository}
        pinned={pinned.some(item => item === repository.name)}
      />
    ))
  }

  render() {
    const { checkAll, loading } = this.state
    const { openModal } = this.props
    return (
      <PortalModal
        showModal={openModal}
        onClose={this.onClose}
      >
        <div className={styles.modal_container}>
          <div className={styles.modal_header}>
            <div className={styles.header}>
              {settingTexts.customize.title}
            </div>
            <div className={styles.header_button}>
              <div
                onClick={this.onCheckAll}
                className={styles.button_check}
              >
                <Icon icon={checkAll ? 'check-square' : 'square-o'} />
                &nbsp;{settingTexts.customize.checkAll}
              </div>
              <Button
                value={settingTexts.customize.confirm}
                color="dark"
                onClick={this.onSubmit}
                className={styles.button}
              />
            </div>
          </div>
          <div className={styles.search_repos}>
            <div className={styles.search_wrapper}>
              <Input
                theme="flat"
                value={this.state.query}
                required={false}
                placeholder={settingTexts.customize.filter}
                onChange={this.onQueryChange}
              />
            </div>
          </div>
          <div className={styles.user_repos}>
            <div className={styles.repos_container}>
              {loading ? (
                <Loading loading />
              ) : (
                <div className={styles.repos_wrapper}>
                  {this.renderRepos()}
                </div>
              )}
            </div>
          </div>
        </div>
      </PortalModal>
    )
  }
}

ReposModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
}

ReposModal.defaultProps = {
  openModal: false,
  onClose: Function.prototype,
  fetchData: Function.prototype,
}

export default ReposModal
