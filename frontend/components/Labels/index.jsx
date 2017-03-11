import React, { PropTypes } from 'react';
import { Input } from 'light-ui';

import Label from './Label';
import styles from './labels.css';

class Labels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
    this.onDelete = this.onDelete.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onDelete(index) {
    const { onDelete } = this.props;
    return () => {
      onDelete && onDelete(index);
    }
  }

  onKeyDown(e) {
    const { value } = this.state;
    if (e.keyCode === 13 && value) {
      const { onAdd } = this.props;
      onAdd && onAdd(value);
      this.clearInput();
    }
  }

  clearInput() {
    this.setState({ value: '' });
  }

  handleInputChange(value) {
    value && this.setState({ value })
  }

  renderLabels() {
    const { labels, color } = this.props;
    return labels.map((label, index) => {
      return (
        <Label
          key={index}
          value={label}
          color={color}
          onDelete={this.onDelete(index)}
        />
      )
    })
  }

  render() {
    const { value } = this.state;
    const { placeholder, max, labels } = this.props;
    return (
      <div className={styles["labels_wrapper"]}>
        {this.renderLabels()}
        { labels.length < max ? (
          <div className={styles["label_input_wrapper"]}>
            <Input
              value={value}
              required={false}
              theme="borderless"
              subTheme="underline"
              placeholder={placeholder}
              onChange={this.handleInputChange}
              onKeyDown={this.onKeyDown}
            />
          </div>
        ) : ''}
      </div>
    )
  }
}

Labels.propTypes = {
  color: PropTypes.string,
  placeholder: PropTypes.string,
  labels: PropTypes.array,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  max: PropTypes.number
};

Labels.defaultProps = {
  labels: [],
  max: 10,
  color: 'grey',
  placeholder: '',
  onDelete: () => {},
  onAdd: () => {}
};

export default Labels;
