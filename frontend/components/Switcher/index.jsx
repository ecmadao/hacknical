import React, { PropTypes } from 'react';
import cx from 'classnames';
import Switchery from 'SRC/vendor/Switchery';
import styles from './switcher.css';

class Switcher extends React.Component {
  componentDidMount() {
    const { size, id } = this.props;
    const checkbox = this.checkbox;
    new Switchery(checkbox, { size });
    $(`#${id}`).on('click', this.onChange.bind(this));
  }

  onChange() {
    const { checked, onChange } = this.props;
    onChange && onChange(!checked);
  }

  render() {
    const { id, checked, onChange } = this.props;
    return (
      <div className={styles["switchery"]} id={id}>
        <input
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
  onChange: PropTypes.func,
  size: PropTypes.string,
};

Switcher.defaultProps = {
  id: '',
  checked: false,
  onChange: () => {},
  size: 'default'
};

export default Switcher;
