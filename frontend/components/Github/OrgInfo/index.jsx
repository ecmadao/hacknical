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
import github from 'UTILS/github';

const fullDate = dateHelper.validator.fullDate;
const githubTexts = locales('github').sections.orgs;

class OrgInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      loaded: false,
      activeIndex: 0
    };
    this.changeAcitveOrg = this.changeAcitveOrg.bind(this);
  }

  componentDidUpdate(preProps) {
    const { userLogin, login } = this.props;
    if (!preProps.login && login) {
      this.getGithubOrgs(userLogin);
    }
  }

  async getGithubOrgs(login) {
    const result = await Api.github.getOrgs(login);
    this.setGithubOrgs(result.orgs);
  }

  setGithubOrgs(orgs = []) {
    this.setState({
      loaded: true,
      orgs: [...orgs]
    });
  }

  changeAcitveOrg(index) {
    const { activeIndex } = this.state;
    if (activeIndex !== index) {
      this.setState({
        activeIndex: index
      });
    }
  }

  renderOrgsCard() {
    const { orgs } = this.state;
    const { login } = this.props;
    const filterRepos = [];
    orgs.forEach((organizations) => {
      const repos = organizations.repos
        .filter(repository => repository.contributors.some(contributor =>
            contributor.login === login)
        );
      filterRepos.push(...repos);
    });
    const totalStar = filterRepos.reduce((prev, current, index) => {
      if (index === 0) {
        return current.stargazers_count;
      }
      return current.stargazers_count + prev;
    }, '');

    return (
      <CardGroup className={cardStyles.card_group}>
        <InfoCard
          icon="group"
          tipsoTheme="dark"
          mainText={orgs.length}
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
    const { activeIndex, orgs } = this.state;

    const orgDOMs = splitArray(orgs, 10).map((organizations, line) => {
      const orgRows = organizations.map((organization, index) => {
        const { avatar_url, name, login } = organization;
        const itemClass = cx(
          styles.org_item,
          activeIndex === index && styles.org_item_active
        );
        return (
          <div key={index} className={styles.org_item_container}>
            <div
              className={itemClass}
              onClick={() => this.changeAcitveOrg(index)}
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
    const { activeIndex, orgs } = this.state;
    const { login } = this.props;
    const activeOrg = orgs[activeIndex];
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
          repos={github.sortByStar(repos)}
          login={login}
        />
      </div>
    );
  }

  render() {
    const { orgs, loaded } = this.state;
    const { className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = !orgs.length
        ? (<div className={cardStyles.empty_card}>
          {githubTexts.emptyText}
        </div>)
        : this.renderOrgsReview();
    }
    const cards = loaded && orgs.length
      ? this.renderOrgsCard()
      : '';
    return (
      <div className={cx(cardStyles.info_card, className)}>
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
