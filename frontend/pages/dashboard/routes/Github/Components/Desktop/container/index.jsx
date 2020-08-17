
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
      githubSections: sections.map(section => objectAssign({}, section, {
        title: getGitHubSectionIntroBySection(section).title.text
      }))
    })
  }

  handleSectionsReorder(githubSections) {
    API.resume.patchResumeInfo({
      githubSections: [...githubSections]
    }).then(() => {
      this.setState({
        githubSections: [...githubSections]
      })
    })
  }

  handleSectionChange(id) {
    this.setState({
      activeSection: id
    })
  }

  render() {
    const {
      activeSection,
      githubSections
    } = this.state

    return (
      <div className={styles.container}>
        <DragableNavigation
          id="github_navigation"
          sections={githubSections}
          activeSection={activeSection}
          onReorder={this.handleSectionsReorder}
          onActiveChange={this.handleSectionChange}
        />
        <GitHub
          sections={githubSections}
        />
      </div>
    )
  }
}

export default GitHubDesktop
