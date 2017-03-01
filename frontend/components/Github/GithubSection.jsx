import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import config from './config';
import Operations from 'COMPONENTS/Operations';
import cardStyles from './styles/info_card.css';

const EmptyDOM = (props) => {
  return (
    <div></div>
  )
};

class GithubSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTipso: false
    };
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  get operationItems() {
    const { callback, section, sectionStatus } = this.props;
    return [
      {
        text: sectionStatus ? '不在分享中展示' : '在分享中展示',
        onClick: () => callback({
          [section]: !sectionStatus
        })
      }
    ]
  }

  onMouseEnter() {
    this.setState({ showTipso: true })
  }

  onMouseLeave() {
    this.setState({ showTipso: false })
  }

  render() {
    const {
      hide,
      disabled,
      title,
      section,
      className,
      isShare
    } = this.props;
    const { showTipso } = this.state;

    if (hide) { return <EmptyDOM />; }

    const Section = config[section] || EmptyDOM;
    const disabledClass = disabled ? cardStyles["info_card_disabled"] : '';

    return (
      <div className={cx(cardStyles["info_card_container"], className)}>
        <p><i aria-hidden="true" className={`fa fa-${title.icon}`}></i>&nbsp;&nbsp;{title.text}</p>
        <Section {...this.props} className={disabledClass} />
        {!isShare ? (
          <Operations
            className={cardStyles["card_operation"]}
            items={this.operationItems}
          />
        ) : ''}
      </div>
    )
  }
}

GithubSection.PropTypes = {
  section: PropTypes.string,
  disabled: PropTypes.bool,
  hide: PropTypes.bool,
  isShare: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string,
  callback: PropTypes.func
};

GithubSection.defaultProps = {
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
  callback: () => {}
};

export default GithubSection;
