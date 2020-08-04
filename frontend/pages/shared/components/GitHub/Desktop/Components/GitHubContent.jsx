
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import FAB from 'COMPONENTS/FloatingActionButton'
import API from 'API'
import GitHub from 'COMPONENTS/GitHub'
import ShareModal from 'COMPONENTS/ShareModal'
import locales from 'LOCALES'
import styles from '../styles/github.css'
import dateHelper from 'UTILS/date'

const githubLocales = locales('github')
const shareText = githubLocales.modal.shareText
const { secondsBefore } = dateHelper.relative

class GitHubContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openShareModal: false
    }
    this.toggleShareModal = this.toggleShareModal.bind(this)
  }

  toggleShareModal(openShareModal) {
    this.setState({ openShareModal })
  }

  renderGitHubSections() {
    const {
      login,
      isShare,
      cardClass,
      githubSections,
      toggleGitHubSection,
      reorderGitHubSections
    } = this.props

    return githubSections.map((section, index) => (
      <GitHub
        id={section.id}
        key={`section.${section.id}`}
        login={login}
        data={section.data}
        loaded={!section.loading}
        title={section.title}
        section={section.id}
        enabled={section.enabled}
        isShare={isShare}
        cardClass={cardClass}
        callback={section => toggleGitHubSection(index, section)}
        intro={section.intro}
      />
    ))
  }

  render() {
    const {
      user,
      origin,
    } = this.props

    const { sections, openShareModal } = this.state
    const { isShare, containerClass, cardClass } = this.props
    const { lastUpdateTime, openShare, shareUrl } = user

    return (
      <div
        className={cx(
          styles.container,
          containerClass
        )}
      >
        {isShare ? (
          <div className={styles.shareInfo}>
            {githubLocales.updateAt}{secondsBefore(lastUpdateTime)}
          </div>
        ) : null}
        {this.renderGitHubSections()}
        {!isShare ? (
          <ShareModal
            openModal={openShareModal}
            options={{
              openShare,
              link: `${origin}/${shareUrl}`,
              text: shareText
            }}
            onClose={() => this.toggleShareModal(false)}
          />
        ) : null}
        {!isShare ? (
          <FAB
            icon="share-alt"
            color="green"
            className={styles.fab}
            onClick={() => this.toggleShareModal(true)}
          />
        ) : null}
      </div>
    )
  }
}

GitHubContent.propTypes = {
  login: PropTypes.string,
  isShare: PropTypes.bool,
  containerClass: PropTypes.string,
  cardClass: PropTypes.string,
  origin: PropTypes.string,
  toggleGitHubSection: PropTypes.func,
  reorderGitHubSections: PropTypes.func,
}

GitHubContent.defaultProps = {
  login: '',
  isShare: false,
  containerClass: '',
  cardClass: '',
  origin: '',
  toggleGitHubSection: Function.prototype,
  reorderGitHubSections: Function.prototype,
}

export default GitHubContent
