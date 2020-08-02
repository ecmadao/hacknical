import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Loading, InfoCard, CardGroup } from 'light-ui'

import API from 'API'
import locales from 'LOCALES'
import dateHelper from 'UTILS/date'
import { splitArray } from 'UTILS/helper'
import OrganizationRepos from './OrganizationRepos'
import cardStyles from '../styles/info_card.css'
import styles from '../styles/github.css'
import Icon from 'COMPONENTS/Icon'

const fullDate = dateHelper.validator.fullDate
const githubTexts = locales('github.sections.orgs')

class OrganizationsInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      activeIndex: 0,
      organizations: [],
    }
    this.changeAcitveOrganization = this.changeAcitveOrganization.bind(this)
  }

  componentDidUpdate(preProps) {
    const { data } = this.props
    if (!preProps.data && data) {
      this.getGithubOrganizations(data)
    }
  }

  async getGithubOrganizations(login) {
    const organizations = await API.github.getOrganizations(login)
    this.setState({
      loaded: true,
      organizations: [...organizations]
    })
  }

  changeAcitveOrganization(index) {
    const { activeIndex } = this.state
    if (activeIndex !== index) {
      this.setState({
        activeIndex: index
      })
    }
  }

  renderOrgsCard() {
    const { organizations } = this.state
    const { login } = this.props
    const filterRepos = []

    for (const organization of organizations) {
      const repos = organization.repos
        .filter(repository => repository.contributors.some(contributor =>
            contributor.login === login)
        )
      filterRepos.push(...repos)
    }

    const totalStar = filterRepos.reduce(
      (prev, current) => current.stargazers_count + prev, 0
    )

    return (
      <CardGroup className={cardStyles.card_group}>
        <InfoCard
          icon="group"
          tipsoTheme="dark"
          mainText={organizations.length}
          subText={githubTexts.orgsCount}
        />
        <InfoCard
          icon="heart-o"
          tipsoTheme="dark"
          mainText={filterRepos.length}
          subText={githubTexts.reposCount}
        />
        <InfoCard
          icon="star-o"
          tipsoTheme="dark"
          mainText={totalStar}
          subText={githubTexts.starsCount}
        />
      </CardGroup>
    )
  }

  renderOrgsReview() {
    const { activeIndex, organizations } = this.state

    const orgDOMs = splitArray(organizations, 10).map((items, line) => {
      const orgRows = items.map((organization, index) => {
        const { avatar_url, name, login } = organization
        const itemClass = cx(
          styles.org_item,
          activeIndex === index && styles.org_item_active
        )
        return (
          <div key={index} className={styles.org_item_container}>
            <div
              className={itemClass}
              onClick={() => this.changeAcitveOrganization(index)}
            >
              <img src={avatar_url} alt="org-avatar" />
              <span>{name || login}</span>
            </div>
          </div>
        )
      })
      return (
        <div key={line} className={styles.org_row}>
          {orgRows}
        </div>
      )
    })

    return (
      <div className={styles.orgs_container}>
        {orgDOMs}
        {this.renderOrgDetail()}
      </div>
    )
  }

  renderOrgDetail() {
    const { activeIndex, organizations } = this.state
    const { login } = this.props
    const activeOrg = organizations[activeIndex]
    const { created_at, description, blog } = activeOrg
    const repos = [...activeOrg.repos] || []

    return (
      <div className={styles.org_detail}>
        <div className={styles.org_info}>
          <Icon icon="rocket" />
          &nbsp;
          {githubTexts.createdAt}{fullDate(created_at)}
        </div>
        {blog && (
          <div className={styles.org_info}>
            <Icon icon="link" />
            &nbsp;&nbsp;
            <a
              href={blog}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blog}
            </a>
          </div>
        )}
        {description && (
          <div className={styles.org_info}>
            <Icon icon="quote-left" />
            &nbsp;&nbsp;
            {description}
          </div>
        )}
        <OrganizationRepos
          repos={repos}
          login={login}
        />
      </div>
    )
  }

  render() {
    const { organizations, loaded } = this.state
    const { className } = this.props
    let component
    if (!loaded) {
      component = (<Loading loading />)
    } else {
      component = !organizations.length
        ? (<div className={cardStyles.empty_card}>
            {githubTexts.emptyText}
          </div>)
        : this.renderOrgsReview()
    }
    return (
      <div className={className}>
        {loaded && organizations.length > 0 ? this.renderOrgsCard() : null}
        {component}
      </div>
    )
  }
}

OrganizationsInfo.propTypes = {
  className: PropTypes.string,
  data: PropTypes.string,
  login: PropTypes.string,
}

OrganizationsInfo.defaultProps = {
  login: '',
  data: '',
  className: ''
}

export default OrganizationsInfo
