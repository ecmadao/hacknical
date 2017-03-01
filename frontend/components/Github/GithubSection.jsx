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
  get operationItems() {
    const { callback, section } = this.props;
    return [
      {
        text: '不在分享中展示',
        onClick: () => callback({
          [section]: false
        })
      }
    ]
  }

  render() {
    const { title, section, className, isShare } = this.props;
    const Section = config[section] || EmptyDOM;
    return (
      <div className={cx(cardStyles["info_card_container"], className)}>
        <p><i aria-hidden="true" className={`fa fa-${title.icon}`}></i>&nbsp;&nbsp;{title.text}</p>
        <Section {...this.props} />
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
  isShare: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string,
  callback: PropTypes.func
};

GithubSection.defaultProps = {
  section: Object.keys(config)[0],
  disabled: false,
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
