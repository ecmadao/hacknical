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
      repositories: [],
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
    const { repositories } = await Api.github.getContributed(login);
    this.setGithubContributed(repositories);
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

  setGithubContributed(repositories = []) {
    const { login } = this.props;
    const filtered = repositories.filter(
      repository => repository.owner && repository.owner.login !== login
    );
    this.setState({
      loaded: true,
      repositories: [...filtered]
    });
  }

  renderContributedRepos() {
    const { repositories, showMore } = this.state;
    const max = !showMore ? DEFAULT_REPOSITORIES : repositories.length;
    const reposRows = repositories.slice(0, max)
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
        {repositories.length > DEFAULT_REPOSITORIES ? (
          <div className={styles.showMoreButton} onClick={this.showMore}>
            {this.buttonText}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    const { repositories, loaded } = this.state;
    const { className } = this.props;
    let component;
    if (!loaded) {
      component = (<Loading loading />);
    } else {
      component = !repositories.length ?
        (
          <div className={cardStyles.empty_card}>
            {githubTexts.emptyText}
          </div>
        ) : this.renderContributedRepos();
    }
    return (
      <div className={className}>
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
