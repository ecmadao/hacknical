import React, { PropTypes } from 'react';
import PortalModal from 'COMPONENTS/PortalModal';
import Selector from 'COMPONENTS/Selector';
import ReposItem from './ReposItem';
import SelectedRepos from './SelectedRepos';
import '../../styles/repos_modal.css';
import {
  getReposByLanguage
} from '../../helper/repos';
import {
  getReposByIds
} from '../../helper/chosed_repos';

class ReposModal extends React.Component {
  constructor(props) {
    super(props);
    const { selectedItems, languages } = this.props;
    this.state = {
      selectedItems,
      selectedLanguage: languages[0]
    };
    this.removeItem = this.removeItem.bind(this);
    this.changeSelectedLanguage = this.changeSelectedLanguage.bind(this);
  }

  changeSelectedLanguage(selectedLanguage) {
    this.setState({ selectedLanguage });
  }

  renderRepos() {
    const { selectedLanguage, selectedItems } = this.state;
    const { repos } = this.props;
    return repos.filter(repository => repository.language === selectedLanguage).map((item, index) => {
      const active = selectedItems.some(id => id === item.reposId);
      return (
        <ReposItem
          key={index}
          active={active}
          repository={item}
        />
      )
    });
  }

  renderSelector() {
    const { languages } = this.props;
    const { selectedLanguage } = this.state;
    const selectorOptions = languages.map((language) => {
      return {
        id: language,
        text: language || 'null'
      }
    });
    return (
      <Selector
        value={selectedLanguage}
        options={selectorOptions}
        style="flat"
        onChange={this.changeSelectedLanguage}
      />
    )
  }

  get selectedRepos() {
    const { repos } = this.props;
    const { selectedItems } = this.state;
    return getReposByIds(repos, selectedItems);
  }

  removeItem(id) {
    const { selectedItems } = this.state;
    const filterResult = selectedItems.filter(item => parseInt(id) !== parseInt(item));
    console.log(filterResult)
    this.setState({
      selectedItems: [...filterResult]
    });
  }

  renderSelectedRepos() {
    return this.selectedRepos.map((repos, index) => {
      return (
        <SelectedRepos
          key={index}
          name={repos.name}
          id={repos.reposId}
          language={repos.language}
          onRemove={this.removeItem}
        />
      )
    });
  }

  render() {
    const { openModal, onClose } = this.props;
    return (
      <PortalModal
        showModal={openModal}
        onClose={onClose}>
        <div className="repos_modal_container">
          <div className="repos_modal_header">
            已选择的仓库
            <div className="repos_selected_container">
              {this.renderSelectedRepos()}
            </div>
          </div>
          <div className="repos_modal_contents">
            <div className="language_selector">
              {this.renderSelector()}
            </div>
            <div className="repos_show_container">
              {this.renderRepos()}
            </div>
          </div>
        </div>
      </PortalModal>
    )
  }
}

ReposModal.propTypes = {
  openModal: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  selectedItems: PropTypes.array,
  repos: PropTypes.array,
  languages: PropTypes.array
};

ReposModal.defaultProps = {
  openModal: false,
  onClose: () => {},
  onSave: () => {},
  selectedItems: [],
  repos: [],
  languages: []
};

export default ReposModal;
