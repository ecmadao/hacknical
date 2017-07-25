import React, { PropTypes } from 'react';
import cx from 'classnames';
import { Loading } from 'light-ui';
import Api from 'API';
import cardStyles from '../styles/info_card.css';
import styles from '../styles/github.css';
import locales from 'LOCALES';
import { sortByX } from 'UTILS/helper';
import ReposRowInfo from '../ReposRowInfo';

const githubTexts = locales('github').sections.contributed;
const sortByStar = sortByX('stargazers_count');

class ContributedInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      loaded: false,
    };
  }

  componentDidUpdate(preProps) {
    const { userLogin, login } = this.props;
    if (!preProps.login && login) {
      this.getGithubContributed(userLogin);
    }
  }

  async getGithubContributed(login) {
    const { repos } = await Api.github.getContributed(login);
    this.setGithubContributed(repos);
  }

  setGithubContributed(repos = []) {
    const { login } = this.props;
    const filtered = repos.filter(
      repository => repository.owner.login !== login
    );
    this.setState({
      loaded: true,
      repos: filtered.sort(sortByStar).reverse()
    });
  }

  renderContributedRepos() {
    const { repos } = this.state;
    const reposRows = repos.map((repository, index) => (
      <ReposRowInfo
        key={index}
        repository={repository}
      />
    ));
    return (
      <div className={styles.reposRows}>
        {reposRows}
      </div>
    );
  }

  render() {
    const { repos, loaded } = this.state;
    const { className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = !repos.length ?
        (
          <div className={cardStyles.empty_card}>
            {githubTexts.emptyText}
          </div>
        ) : this.renderContributedRepos();
    }
    return (
      <div className={cx(cardStyles.info_card, className)}>
        {component}
      </div>
    );
  }
}

ContributedInfo.propTypes = {
  className: PropTypes.string,
  userLogin: PropTypes.string,
  login: PropTypes.string,
};

ContributedInfo.defaultProps = {
  login: '',
  userLogin: '',
  className: ''
};

export default ContributedInfo;
