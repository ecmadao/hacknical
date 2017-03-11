import React, { PropTypes } from 'react';
import Cleave from 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.cn';
import { Input } from 'light-ui';

const FORMAT_TYPES = {
  date: {
    date: true,
    datePattern: ['Y', 'm', 'd']
  },
  phone: {
    phone: true,
    phoneRegionCode: 'CN'
  },
  number: {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
  }
};

class FormatInput extends React.Component {
  componentDidMount() {
    const { id, formatType } = this.props;
    new Cleave(`#${id}`, FORMAT_TYPES[formatType]);
  }

  render() {
    return (
      <Input {...this.props} />
    )
  }
}

export default FormatInput;
