import React, { PropTypes } from 'react';

import styles from '../styles/github.css';
import dateHelper from 'UTILS/date';
import locales from 'LOCALES';
import ContributionChart from './ContributionChart';

const githubTexts = locales('github').sections.orgs;
const fullDate = dateHelper.validator.fullDate;
const filterRepos = (repos, login) => {
  return repos.filter(repository => repository.contributors.some(contributor => contributor.login === login));
};

class OrgRepos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeReposIndex: 0
    };
    this.changeAcitveRepos = this.changeAcitveRepos.bind(this);
  }

  changeAcitveRepos(index) {
    const { activeReposIndex } = this.state;
    if (activeReposIndex !== index) {
      this.setState({
        activeReposIndex: index
      });
    }
  }

  renderReposTipso(repository, contributionPercentage) {
    const {
      name,
      description,
      created_at,
      stargazers_count,
      contributors,
      forks_count,
      pushed_at,
      language,
      html_url,
      fork
    } = repository;

    return (
      <div className={styles["tipso_wrapper"]}>
        <div className={styles["tipso_container"]}>
          <span className={styles["tipso_title"]}>
            <a href={html_url} target="_blank">
              {name}
            </a>
            &nbsp;&nbsp;
            {`<${language}>`}
            &nbsp;&nbsp;
            {fork ? '<fork>' : ''}
          </span><br/>
          <span>{fullDate(created_at)} ~ {fullDate(pushed_at)}</span>
          <div className={styles["tipso_line"]}></div>
          <span>
            <i className="fa fa-star" aria-hidden="true"></i>&nbsp;{stargazers_count}
            &nbsp;&nbsp;&nbsp;
            <i className="fa fa-code-fork" aria-hidden="true"></i>&nbsp;{forks_count}
            &nbsp;&nbsp;
            {githubTexts.contributionPercentage}: {`${contributionPercentage.toFixed(2)}%`}
          </span><br/>
          <blockquote>{description}</blockquote>
        </div>
      </div>
    )
  }

  renderRepos() {
    const { activeReposIndex } = this.state;
    const { repos, userLogin } = this.props;
    const activeIndex = activeReposIndex >= repos.length ? 0 : activeReposIndex;
    return repos.map((repository, index) => {
      const { contributors } = repository;
      const filterContributions = contributors.filter(contributor => contributor.login === userLogin);
      const totalContributions = contributors.reduce((prev, current, index) => {
        if (index === 0) {
          return current.total;
        }
        return current.total + prev;
      }, '');
      const userContributions = filterContributions.length ? filterContributions[0].total : 0;
      const percentage = totalContributions ? (userContributions / totalContributions) * 100 : 0;
      return (
        <div className={styles["repos_item"]} key={index}>
          <div
            onClick={() => this.changeAcitveRepos(index)}
            className={styles["repos_contributions"]}>
            <div
              style={{ width: `${percentage}%` }}
              className={styles["user_contributions"]}></div>
            {this.renderReposTipso(repository, percentage)}
          </div>
          {activeIndex === index ? (
            <ContributionChart
              contribution={filterContributions[0]}
            />
          ) : ''}
        </div>
      )
    });
  }

  render() {
    return (
      <div>
        <div className={styles["org_info_title"]}>
          {githubTexts.joinedRepos}
        </div>
        <div className={styles["orgs_coordinate"]}>
          <div className={styles["repos_xAxes"]}>
            <div className={styles["xAxes_text"]}>{githubTexts.contributionPercentage}</div>
          </div>
          <div className={styles["repos_wrapper"]}>
            <div className={styles["repos"]}>
              {this.renderRepos()}
            </div>
            <div className={styles["repos_yAxes"]}>
              <div className={styles["yAxes_text"]}>stars</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

OrgRepos.propTypes = {
  repos: PropTypes.array,
  userLogin: PropTypes.string,
};

OrgRepos.defaultProps = {
  repos: [],
  userLogin: ''
};

export default OrgRepos;
