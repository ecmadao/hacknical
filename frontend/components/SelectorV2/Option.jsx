import React from 'react';
import cx from 'classnames';
import styles from './selector_v2.css';

class Option extends React.Component {

  onClick(e) {
    const { onClick, id, isActive } = this.props;
    !isActive && onClick && onClick(id);
    e.stopPropagation();
    return false;
  }

  render() {
    const { isActive, value } = this.props;
    const optionClass = cx(
      styles.option,
      isActive && styles['option-active']
    );
    return (
      <div
        onClick={this.onClick.bind(this)}
        className={optionClass}>
        <div className={styles['option-wrapper']}>
          {value}
        </div>
      </div>
    )
  }
}

export default Option;
