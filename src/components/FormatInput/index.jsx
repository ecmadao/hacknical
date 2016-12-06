import React, { PropTypes } from 'react';
import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.cn';
import Input from 'COMPONENTS/Input';

const FORMAT_TYPES = {
  date: {
    date: true,
    datePattern: ['Y', 'm', 'd']
  },
  phone: {
    phone: true,
    phoneRegionCode: 'CN'
  }
};

class FormatInput extends React.Component {
  componentDidMount() {
    const { className, formatType } = this.props;
    new Cleave(`.${className}`, FORMAT_TYPES[formatType]);
  }

  render() {
    return (
      <Input {...this.props} />
    )
  }
}

export default FormatInput;
