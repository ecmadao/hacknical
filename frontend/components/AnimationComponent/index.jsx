
import React, { cloneElement } from 'react';

class AnimationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'hidden'
    };
    this.onExit = this.onExit.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  componentDidMount(){
    setTimeout(this.mountAnimation.bind(this), 10);
  }

  componentWillUnmount() {
    clearTimeout(this.exitingTimeout);
  }

  onTransitionEnd() {
    this.setState({
      status: 'entered'
    });
  }

  onExit(callback) {
    this.exitingTimeout = setTimeout(() => callback && callback(), 100);
    this.unmountAnimation();
  }

  unmountAnimation() {
    this.setState({
      status: 'exiting'
    });
  }

  mountAnimation() {
    this.setState({
      status: 'entering'
    });
  }

  render() {
    const { status } = this.state;
    console.log(`status: ${status}`);
    const children = cloneElement(this.props.children, {
      status,
      onExit: this.onExit,
      onTransitionEnd: this.onTransitionEnd,
    });

    return children;
  }
}

export default AnimationComponent;
