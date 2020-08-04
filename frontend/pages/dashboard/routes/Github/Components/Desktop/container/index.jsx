
import React from 'react'
import cx from 'classnames'
import API from 'API'
import locales from 'LOCALES'
import styles from '../styles/github.css'
import Navigation from 'COMPONENTS/Navigation'
import DragAndDrop from 'COMPONENTS/DragAndDrop'
import GitHub from 'SHARED/components/GitHub/Desktop'
import {
  DEFAULT_GITHUB_SECTIONS,
} from 'UTILS/constant'

const githubText = locales('github.sections')

class GitHubDesktop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSection: null,
      githubSections: []
    }
    this.handleSectionsReorder = this.handleSectionsReorder.bind(this)
    this.handleSectionChange = this.handleSectionChange.bind(this)
  }

  componentDidMount() {
    this.fetchGitHubSections()
  }

  async fetchGitHubSections() {
    const sectionData = await API.user.getGitHubSections()
    const sections = sectionData || [...DEFAULT_GITHUB_SECTIONS]

    this.setState({
      activeSection: sections[0].id,
      githubSections: sections
    })
  }

  handleSectionsReorder(order) {
    const fromIndex = order.source.index
    const toIndex = order.destination.index
    if (toIndex === fromIndex) return

    const githubSections = [...this.state.githubSections]

    const [githubSection] = githubSections.splice(fromIndex, 1)
    githubSections.splice(toIndex, 0, githubSection)

    API.resume.patchResumeInfo({
      githubSections: [...githubSections]
    }).then(() => {
      this.setState({
        githubSections: [...githubSections]
      })
    })
  }

  handleSectionChange(id) {
    return () => {
      this.setState({
        activeSection: id
      })

      const href = window.location.href
      window.location.href = [
        window.location.origin,
        window.location.pathname,
        window.location.search,
        `#${id}`
      ].join('')
    }
  }

  render() {
    const {
      activeSection,
      githubSections
    } = this.state

    return (
      <div className={styles.container}>
        <Navigation
          fixed
          id="github_navigation"

          navigationCardClassName={styles.navigationCard}
          navigationCardBgClassName={styles.navigationCardBg}
        >
          <DragAndDrop
            containerClassName={styles.dragableWrapper}
            onDragEnd={this.handleSectionsReorder}
          >
            {githubSections.map((section, index) => ({
              id: section.id,
              itemClassName: cx(
                styles.dragableSection,
                activeSection === section.id && styles.active
              ),
              Component: (
                <div
                  key={`${section.id}-${index}`}
                  className={styles.navSectionWrapper}
                  onClick={this.handleSectionChange(section.id)}
                >
                  {githubText[section.id].title}
                </div>
              )
            }))}
          </DragAndDrop>
        </Navigation>
        <GitHub
          sections={githubSections}
        />
      </div>
    )
  }
}

export default GitHubDesktop
