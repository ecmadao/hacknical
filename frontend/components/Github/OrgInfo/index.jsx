import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Loading, InfoCard, CardGroup } from 'light-ui';

import Api from 'API';
import OrgRepos from './OrgRepos';
import cardStyles from '../styles/info_card.css';
import styles from '../styles/github.css';
import locales from 'LOCALES';
import { splitArray } from 'UTILS/helper';
import dateHelper from 'UTILS/date';

const fullDate = dateHelper.validator.fullDate;
const githubTexts = locales('github').sections.orgs;

class OrgInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizations: [],
      loaded: false,
      activeIndex: 0
    };
    this.changeAcitveOrganization = this.changeAcitveOrganization.bind(this);
  }

  componentDidUpdate(preProps) {
    const { userLogin, login } = this.props;
    if (!preProps.login && login) {
      this.getGithubOrganizations(userLogin);
    }
  }

  async getGithubOrganizations(login) {
    const result = await Api.github.getOrganizations(login);
    this.setState({
      loaded: true,
      organizations: [...result.organizations]
    });
  }

  changeAcitveOrganization(index) {
    const { activeIndex } = this.state;
    if (activeIndex !== index) {
      this.setState({
        activeIndex: index
      });
    }
  }

  renderOrgsCard() {
    const { organizations } = this.state;
    const { login } = this.props;
    const filterRepos = [];
    organizations.forEach((organization) => {
      const repos = organization.repos
        .filter(repository => repository.contributors.some(contributor =>
            contributor.login === login)
        );
      filterRepos.push(...repos);
    });
    const totalStar = filterRepos.reduce(
      (prev, current) => current.stargazers_count + prev, 0
    );

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
    );
  }

  renderOrgsReview() {
    const { activeIndex, organizations } = this.state;

    const orgDOMs = splitArray(organizations, 10).map((items, line) => {
      const orgRows = items.map((organization, index) => {
        const { avatar_url, name, login } = organization;
        const itemClass = cx(
          styles.org_item,
          activeIndex === index && styles.org_item_active
        );
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
        );
      });
      return (
        <div key={line} className={styles.org_row}>
          {orgRows}
        </div>
      );
    });

    return (
      <div className={styles.orgs_container}>
        {orgDOMs}
        {this.renderOrgDetail()}
      </div>
    );
  }

  renderOrgDetail() {
    const { activeIndex, organizations } = this.state;
    const { login } = this.props;
    const activeOrg = organizations[activeIndex];
    const { created_at, description, blog } = activeOrg;
    const repos = [...activeOrg.repos] || [];

    return (
      <div className={styles.org_detail}>
        <div className={styles.org_info}>
          <i className="fa fa-rocket" aria-hidden="true" />
          &nbsp;
          {githubTexts.createdAt}{fullDate(created_at)}
        </div>
        {blog ? (
          <div className={styles.org_info}>
            <i className="fa fa-link" aria-hidden="true" />
            &nbsp;&nbsp;
            <a
              href={blog}
              target="_blank"
              rel="noopener noreferrer"
            >
              {blog}
            </a>
          </div>
        ) : ''}
        {description ? (
          <div className={styles.org_info}>
            <i className="fa fa-quote-left" aria-hidden="true" />
            &nbsp;&nbsp;
            {description}
          </div>
        ) : ''}
        <OrgRepos
          repos={repos}
          login={login}
        />
      </div>
    );
  }

  render() {
    const { organizations, loaded } = this.state;
    const { className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = !organizations.length
        ? (<div className={cardStyles.empty_card}>
          {githubTexts.emptyText}
        </div>)
        : this.renderOrgsReview();
    }
    const cards = loaded && organizations.length
      ? this.renderOrgsCard()
      : '';
    return (
      <div className={className}>
        {cards}
        {component}
      </div>
    );
  }
}

OrgInfo.propTypes = {
  className: PropTypes.string,
  userLogin: PropTypes.string,
  login: PropTypes.string,
};

OrgInfo.defaultProps = {
  login: '',
  userLogin: '',
  className: ''
};

export default OrgInfo;
