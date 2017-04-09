import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { Tipso } from 'light-ui';

import config from './config';
import Operations from 'COMPONENTS/Operations';
import cardStyles from './styles/info_card.css';
import locales from 'LOCALES';

const operationTexts = locales('github').operations;
const EmptyDOM = (props) => {
  return (
    <div></div>
  )
};

class GitHubSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOperations: false
    };
    this.onMenuClick = this.onMenuClick.bind(this);
    this.onOperationFocusChange = this.onOperationFocusChange.bind(this);
  }

  onOperationFocusChange(value) {
    this.setState({
      showOperations: value
    });
  }

  onMenuClick(value) {
    const { callback } = this.props;
    callback && callback(value);
    this.onOperationFocusChange(false);
  }

  get operationItems() {
    const { section, sectionStatus } = this.props;
    return [
      {
        text: sectionStatus ? operationTexts.share.hide : operationTexts.share.show,
        onClick: () => this.onMenuClick({
          [section]: !sectionStatus
        })
      }
    ]
  }

  render() {
    const {
      hide,
      intro,
      title,
      section,
      isShare,
      disabled,
      className
    } = this.props;
    const { showOperations } = this.state;
    if (hide) { return <EmptyDOM />; }

    const Section = config[section] || EmptyDOM;
    const disabledClass = disabled ? cardStyles["info_card_disabled"] : '';

    return (
      <div className={cx(cardStyles["info_card_container"], className)}>
        <p>
          <i aria-hidden="true" className={`fa fa-${title.icon}`}></i>
          &nbsp;&nbsp;{title.text}&nbsp;&nbsp;
          {intro && !isShare ? (
            <Tipso
              className={cardStyles["card_tipso"]}
              tipsoContent={(<span>{intro.text}</span>)}>
              <span
                className={cardStyles["card_intro"]}>
                <i className={`fa fa-${intro.icon}`} aria-hidden="true"></i>
              </span>
            </Tipso>
          ) : ''}
        </p>
        <Section {...this.props} className={disabledClass} />
        {!isShare ? (
          <Operations
            className={cardStyles["card_operation"]}
            items={this.operationItems}
            showOperations={showOperations}
            onFocusChange={this.onOperationFocusChange}
          />
        ) : ''}
      </div>
    )
  }
}

GitHubSection.PropTypes = {
  section: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
  isShare: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string,
  callback: PropTypes.func,
  intro: PropTypes.object
};

GitHubSection.defaultProps = {
  section: Object.keys(config)[0],
  disabled: false,
  hide: false,
  isShare: false,
  show: true,
  title: {
    text: '',
    icon: ''
  },
  className: '',
  callback: () => {},
  intro: null
};

export default GitHubSection;
