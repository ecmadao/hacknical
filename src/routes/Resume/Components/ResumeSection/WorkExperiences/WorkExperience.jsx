import React, { PropTypes } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/css/styles.scss';
import moment from 'moment';

import Input from 'COMPONENTS/Input';
import Selector from 'COMPONENTS/Selector';
import { EDUCATIONS } from '../../../helper/const_value';
moment.locale('zh-cn');

class WorkExperience extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startOpen: false,
      endOpen: false
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleStartFocus = this.handleStartFocus.bind(this);
    this.handleEndFocus = this.handleEndFocus.bind(this);
  }

  handleStartFocus({ focused: startOpen }) {
    this.setState({ startOpen });
  }

  handleEndFocus({ focused: endOpen }) {
    this.setState({ endOpen });
  }

  onDateChange(type) {

  }

  render() {
    const {workExperience} = this.props;
    return (
      <div>

      </div>
    )
  }
}

export default WorkExperience;
