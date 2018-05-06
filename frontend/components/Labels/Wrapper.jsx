import React from 'react';
import PropTypes from 'prop-types';
import { Label, InputGroup } from 'light-ui';
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
    };
  }

  renderLabels() {
    const { labels, disabled } = this.props;
    return labels.map((label, index) => (
      <Label
        key={index}
        text={label}
        color="darkLight"
        deleteable
        disabled={disabled}
        clickable={false}
        className={styles.label}
        onDelete={this.onDelete(index)}
      />
    ));
  }

  render() {
    const {
      max,
      value,
      labels,
      introText,
      disabled,
      onKeyDown,
      onChange,
      placeholder,
    } = this.props;
    return (
      <div className={styles.labels_wrapper}>
        {this.renderLabels()}
        { labels.length < max ? (
          <div className={styles.label_input_wrapper}>
            <InputGroup
              value={value}
              required={false}
              theme="borderless"
              subTheme="underline"
              placeholder={placeholder}
              onChange={onChange}
              onKeyDown={onKeyDown}
              disabled={disabled}
              wrapperClassName={styles.wrapper}
              tipsoTheme="dark"
              tipsoPosition="bottom"
              tipsoStyle={{
                left: '0',
                transform: 'translateX(0) translateY(7px)'
              }}
              inputClassName={styles.input}
            >
              <div className={styles.intro}>
                {introText}
              </div>
            </InputGroup>
          </div>
        ) : ''}
      </div>
    );
  }
}

Wrapper.propTypes = {
  introText: PropTypes.string,
  placeholder: PropTypes.string,
  labels: PropTypes.array,
  onDelete: PropTypes.func,
  max: PropTypes.number
};

Wrapper.defaultProps = {
  labels: [],
  max: 10,
  introText: '',
  placeholder: '',
  onDelete: () => {},
};

export default Wrapper;
