import React from 'react';
import cx from 'classnames';
import Headroom from 'headroom.js';
import 'SRC/vendor/topBar/index.css';
import styles from './topbar.css';

class Topbar extends React.Component {
  componentDidMount() {
    const { offsetTop = 50, headroomClasses } = this.props;
    Headroom.options.offset = offsetTop;
    const headroom = new Headroom(this.topBar, {
      classes: headroomClasses
    });
    headroom.init();
  }

  render() {
    const {
      wrapperClassName = '',
      containerClassName = '',
    } = this.props;
    return (
      <div className="app_tabs" ref={ref => (this.topBar = ref)}>
        <div className={cx(styles.barWrapper, wrapperClassName)}>
          <div className={cx(styles.barContainer, containerClassName)}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
