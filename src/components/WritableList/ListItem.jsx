import React, { PropTypes } from 'react';
import Input from 'COMPONENTS/Input';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, onChange, onDelete, placeholder } = this.props;
    return (
      <li className="list_item">-&nbsp;&nbsp;
        <Input
          value={item}
          onChange={onChange}
          placeholder={placeholder}
          style="borderless underline"
        />&nbsp;&nbsp;&nbsp;
        <i
          className="fa fa-close"
          aria-hidden="true"
          onClick={onDelete}></i>
      </li>
    )
  }
}

ListItem.propTypes = {
  item: PropTypes.string,
  onDelete: PropTypes.func,
  onChange: PropTypes.func
};

ListItem.defaultProps = {
  item: '',
  onDelete: () => {},
  onChange: () => {}
};

export default ListItem;
