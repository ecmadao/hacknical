import React, { PropTypes } from 'react';
import cx from 'classnames';
import Switchery from 'switchery';

class Switcher extends React.Component {
  componentDidMount() {
    const { id } = this.props;
    var elem = document.querySelector(`#${id}`);
    new Switchery(elem);
  }

  render() {
    const { id, checked } = this.props;
    return (
      <div>
        <input
          id={id}
          type="checkbox"
          checked={checked}
        />
      </div>
    )
  }
}

Switcher.propTypes = {
  id: PropTypes.string,
  checked: PropTypes.bool
};

Switcher.defaultProps = {
  id: '',
  checked: false
};

export default Switcher;
