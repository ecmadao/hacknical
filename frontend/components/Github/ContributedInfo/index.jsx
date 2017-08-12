import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Loading } from 'light-ui';
import Api from 'API';
import cardStyles from '../styles/info_card.css';
import styles from '../styles/github.css';
import locales from 'LOCALES';
import ReposRowInfo from '../ReposRowInfo';
import objectAssign from 'UTILS/object-assign';

const DEFAULT_REPOSITORIES = 5;
const githubTexts = locales('github').sections.contributed;

class ContributedInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: [],
      loaded: false,
      showMore: false,
    };
    this.showMore = this.showMore.bind(this);
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

  showMore() {
    const { showMore } = this.state;
    this.setState({
      showMore: !showMore
    });
  }

  get buttonText() {
    const { showMore } = this.state;
    return !showMore ? githubTexts.showMore : githubTexts.hideMore;
  }

  setGithubContributed(repos = []) {
    const { login } = this.props;
    const filtered = repos.filter(
      repository => repository.owner.login !== login
    );
    this.setState({
      loaded: true,
      repos: [...filtered]
    });
  }

  renderContributedRepos() {
    const { repos, showMore } = this.state;
    const max = !showMore ? DEFAULT_REPOSITORIES : repos.length;
    const reposRows = repos.slice(0, max)
      .map((repository, index) => (
        <ReposRowInfo
          key={index}
          repository={objectAssign({}, repository, {
            name: repository.full_name
          })}
        />
      ));
    return (
      <div className={styles.reposRows}>
        {reposRows}
        <div className={styles.showMoreButton} onClick={this.showMore}>
          {this.buttonText}
        </div>
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
