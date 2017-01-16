import React, { PropTypes } from 'react';
import cx from 'classnames';
import Switchery from 'switchery';
import styles from './switcher.css';

class Switcher extends React.Component {
  componentDidMount() {
    const checkbox = this.checkbox;
    new Switchery(checkbox);
    $('.switchery').on('click', this.onChange.bind(this));
  }

  onChange() {
    const { checked, onChange } = this.props;
    onChange && onChange(!checked);
  }

  render() {
    const { id, checked, onChange } = this.props;
    return (
      <div className={styles["switchery"]}>
        <input
          id={id}
          type="checkbox"
          defaultChecked={checked}
          ref={ref => this.checkbox = ref}
        />
      </div>
    )
  }
}

Switcher.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

Switcher.defaultProps = {
  id: '',
  checked: false,
  onChange: () => {}
};

export default Switcher;
