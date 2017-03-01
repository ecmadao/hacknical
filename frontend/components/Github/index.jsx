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

class Github extends React.Component {
  get operationItems() {
    const { actions } = this.props;
    return [
      {
        text: '不在分享中展示',
        onClick: () => {}
      }
    ]
  }

  render() {
    const { title, section, children, className } = this.props;
    const Section = config[section] || EmptyDOM;
    return (
      <div className={cx(cardStyles["info_card_container"], className)}>
        <p><i aria-hidden="true" className={`fa fa-${title.icon}`}></i>&nbsp;&nbsp;{title.text}</p>
        <Section {...this.props} />
        <Operations
          className={cardStyles["card_operation"]}
          items={this.operationItems}
        />
      </div>
    )
  }
}

Github.PropTypes = {
  section: PropTypes.string,
  disabled: PropTypes.bool,
  show: PropTypes.bool,
  title: PropTypes.object,
  className: PropTypes.string
};

Github.defaultProps = {
  section: Object.keys(config)[0],
  disabled: false,
  show: true,
  title: {
    text: '',
    icon: ''
  },
  className: ''
};

export default Github;
