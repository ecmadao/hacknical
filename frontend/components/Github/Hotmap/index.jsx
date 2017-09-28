/* eslint new-cap: "off" */

import React from 'react';
import cx from 'classnames';
import { Loading } from 'light-ui';
import Api from 'API';
import 'SRC/vendor/share/github-calendar.css';
import styles from '../styles/github.css';

class Hotmap extends React.Component {
  constructor(props) {
    super(props);
    this.githubCalendar = false;
  }

  componentDidUpdate() {
    const { login } = this.props;
    if (!this.githubCalendar && login && $('#calendar')[0]) {
      this.getCalendar(login);
    }
  }

  async getCalendar(login) {
    this.githubCalendar = true;
    const cal = await Api.github.getUserCalendar(login);
    document.getElementById('calendar').innerHTML = cal;
  }

  render() {
    const { className } = this.props;
    return (
      <div
        id="calendar"
        className={cx(
          styles.github_calendar,
          className
        )}
      >
        <Loading loading />
      </div>
    );
  }
}

Hotmap.defaultProps = {
  className: ''
};

export default Hotmap;
