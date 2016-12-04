import React, { PropTypes } from 'react';
import Input from 'COMPONENTS/Input';

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    // this.onChange = this.onChange.bind(this);
  }

  render() {
    const {item, onChange} = this.props;
    return (
      <li>-&nbsp;&nbsp;
        <Input
          value={item}
          onChange={onChange}
          placeholder="项目描述"
          style="borderless"
        />
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
