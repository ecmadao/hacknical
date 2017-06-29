import React, { PropTypes } from 'react';
import { Input, Label } from 'light-ui';
import styles from './labels.css';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete(index) {
    const { onDelete } = this.props;
    return () => {
      onDelete && onDelete(index);
    }
  }

  renderLabels() {
    const { labels, color } = this.props;
    return labels.map((label, index) => {
      return (
        <Label
          key={index}
          text={label}
          color="darkLight"
          deleteable
          clickable={false}
          className={styles.label}
          onDelete={this.onDelete(index)}
        />
      );
    });
  }

  render() {
    const {
      max,
      value,
      labels,
      onKeyDown,
      onChange,
      placeholder,
    } = this.props;
    return (
      <div className={styles['labels_wrapper']}>
        {this.renderLabels()}
        { labels.length < max ? (
          <div className={styles['label_input_wrapper']}>
            <Input
              value={value}
              required={false}
              theme="borderless"
              subTheme="underline"
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
            />
          </div>
        ) : ''}
      </div>
    );
  }
}

Wrapper.propTypes = {
  color: PropTypes.string,
  placeholder: PropTypes.string,
  labels: PropTypes.array,
  onDelete: PropTypes.func,
  onAdd: PropTypes.func,
  max: PropTypes.number
};

Wrapper.defaultProps = {
  labels: [],
  max: 10,
  color: 'grey',
  placeholder: '',
  onDelete: () => {},
  onAdd: () => {}
};

export default Wrapper;
