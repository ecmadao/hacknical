import React, { PropTypes } from 'react';
import { PortalModal, Button, Loading, Input } from 'light-ui';
import Api from 'API';
import ReposCard from './ReposCard';
import styles from '../styles/modal.css';
import locales from 'LOCALES';

const settingTexts = locales('dashboard').setting.github;

class ReposModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawPinned: [],
      pinned: [],
      repos: [],
      query: '',
      checkAll: false,
      loading: true
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCheckAll = this.onCheckAll.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.addPinnedRepos = this.addPinnedRepos.bind(this);
    this.removePinnedRepos = this.removePinnedRepos.bind(this);
  }

  componentDidMount() {
    this.fetchPinnedRepos();
  }

  componentDidUpdate(preProps) {
    const { openModal } = this.props;
    const { repos } = this.state;
    if (openModal && !preProps.openModal) {
      !repos.length && this.fetchRepos();
    }
  }

  onClose() {
    const { rawPinned } = this.state;
    const { onClose } = this.props;
    this.changeState({
      pinned: [...rawPinned]
    });
    onClose && onClose();
  }

  onSubmit() {
    const { pinned } = this.state;
    const { onClose } = this.props;
    const pinnedRepos = pinned.join(',');
    Api.user.setPinnedRepos(pinnedRepos);
    this.changeState({
      rawPinned: [...pinned]
    });
    onClose && onClose();
  }

  onCheckAll() {
    const { checkAll, pinned } = this.state;
    const newPinned = !checkAll ? this.defaultPinned() : [];
    this.changeState({
      checkAll: !checkAll,
      pinned: [...newPinned]
    });
  }

  defaultPinned(repos = null) {
    repos = repos ? repos : this.state.repos;
    return repos.map(repository => repository.reposId);
  }

  async fetchRepos() {
    const { pinned } = this.state;
    const result = await Api.github.getAllRepos();
    const pinnedRepos = pinned.length ? pinned : this.defaultPinned(result);
    this.changeState({
      repos: [...result],
      pinned: [...pinnedRepos],
      rawPinned: [...pinnedRepos],
      loading: false,
      checkAll: !pinned.length || pinned.length === result.length
    });
  }

  async fetchPinnedRepos() {
    const result = await Api.user.getPinnedRepos();
    const pinned = result.length ? result : this.defaultPinned();
    this.changeState({
      pinned: [...pinned],
      rawPinned: [...pinned]
    });
  }

  onQueryChange(query) {
    this.changeState({ query });
  }

  changeState(state) {
    this.setState(state);
  }

  addPinnedRepos(repositoryId) {
    const { pinned } = this.state;
    this.changeState({
      pinned: [...pinned, repositoryId]
    });
  }

  removePinnedRepos(repositoryId) {
    const { pinned } = this.state;
    this.changeState({
      pinned: pinned.filter(item => item !== repositoryId)
    });
  }

  renderRepos() {
    const { repos, pinned, query } = this.state;
    const pattern = new RegExp(query);
    const filterRepos = query ? repos.filter(repository => pattern.test(repository.name)) : repos;
    return filterRepos.map((repository, index) => {
      return (
        <ReposCard
          key={index}
          repository={repository}
          onRemove={this.removePinnedRepos}
          onPinned={this.addPinnedRepos}
          pinned={pinned.some(item => item === repository.reposId)}
        />
      )
    })
  }

  render() {
    const { checkAll, loading } = this.state;
    const { openModal } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={this.onClose}>
        <div className={styles['modal_container']}>
          <div className={styles['modal_header']}>
            <div className={styles['header']}>
              {settingTexts.customize.title}
            </div>
            <div className={styles['header_button']}>
              <div
                onClick={this.onCheckAll}
                className={styles['button_check']}>
                <i aria-hidden="true" className={`fa fa-${checkAll ? 'check-square' : 'square-o'}`}></i>
                &nbsp;{settingTexts.customize.checkAll}
              </div>
              <Button
                value={settingTexts.customize.confirm}
                color="dark"
                onClick={this.onSubmit}
                className={styles['button']}
              />
            </div>
          </div>
          <div className={styles['search_repos']}>
            <div className={styles['search_wrapper']}>
              <Input
                theme="flat"
                value={this.state.query}
                required={false}
                placeholder={settingTexts.customize.filter}
                onChange={this.onQueryChange}
              />
            </div>
          </div>
          <div className={styles['user_repos']}>
            <div className={styles['repos_container']}>
              {loading ? (
                <Loading loading={true} />
              ) : (
                <div className={styles['repos_wrapper']}>
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
  fetchData: PropTypes.func,
  repos: PropTypes.array
}

ReposModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  fetchData: () => {},
  repos: []
};

export default ReposModal;
