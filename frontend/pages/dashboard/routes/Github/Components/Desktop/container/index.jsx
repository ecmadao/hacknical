
import React from 'react'
import API from 'API'
import styles from '../styles/github.css'
import objectAssign from 'UTILS/object-assign'
import GitHub from 'SHARED/components/GitHub/Desktop'
import {
  DEFAULT_GITHUB_SECTIONS,
  getGitHubSectionIntroBySection
} from 'UTILS/constant/github'
import DragableNavigation from 'SHARED/components/DragableNavigation'

class GitHubDesktop extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSection: null,
      githubSections: [],
      loading: true
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
      loading: false,
      activeSection: sections[0].id,
      githubSections: sections.map(section => objectAssign({}, section, {
        title: getGitHubSectionIntroBySection(section).title.text
      }))
    })
  }

  async handleSectionsReorder(githubSections) {
    this.setState({ loading: true })

    try {
      await API.resume.patchResumeInfo({
        githubSections: [...githubSections]
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.setState({
        loading: false,
        githubSections: [...githubSections]
      })
    }
  }

  handleSectionChange(id) {
    this.setState({
      activeSection: id
    })
  }

  render() {
    const {
      loading,
      activeSection,
      githubSections
    } = this.state

    return (
      <div className={styles.container}>
        <DragableNavigation
          id="github_navigation"
          disabled={loading}
          sections={githubSections}
          activeSection={activeSection}
          onReorder={this.handleSectionsReorder}
          onActiveChange={this.handleSectionChange}
        />
        <GitHub sections={githubSections} />
      </div>
    )
  }
}

export default GitHubDesktop
